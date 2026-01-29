import { createClient } from "redis";
import { io } from "../index";
import docker from "../config/docker.config";
import Workflow from "../features/workflow/workflow.model";
import { inngest } from "../inngest";

import redisClient from "../config/redis.config";

const subscriber = createClient({ url: process.env.REDIS_URL });

subscriber.on("error", (err) => console.error("Redis Subscriber Error:", err));

await subscriber.connect();

await subscriber.configSet("notify-keyspace-events", "Khx");

await subscriber.pSubscribe(
  "__keyspace@0__:container:*",
  async (message, channel) => {
    const containerId = channel.split(":")[2];
    const workflow = await Workflow.findOne({ dockerId: containerId });
    if (!workflow) {
      return;
    }

    if (message === "hset") {
      const containerData = (await redisClient.hGetAll(`container:${containerId}`)) as unknown as {
        status: string;
        workflowId: string;
      };

      if (containerData && (containerData.status === "up" || containerData.status === "ready")) {
        return;
      }
      console.log(`Container added/updated: ${containerId}`);
      io.emit("container_added", {
        workflowId: workflow._id,
        containerId,
        timestamp: Date.now(),
      });
    }

    if (message === "del") {
      console.log(`Container deleted: ${containerId}`);
      io.emit("container_deleted", {
        workflowId: workflow._id,
        containerId,
        timestamp: Date.now(),
      });
      await Workflow.findOneAndUpdate(
        { dockerId: containerId },
        { status: false },
      );
    }

    if (message === "expired") {
      console.log(`Container expired: ${containerId}`);
      await inngest.send({
        name: "workflow/workflow.deactivated",
        data: {
          workflowId: workflow._id,
          containerId,
          timestamp: Date.now(),
        },
      });
      io.emit("container_expired", {
        workflowId: workflow._id,
        containerId,
        timestamp: Date.now(),
      });
      await Workflow.findOneAndUpdate(
        { dockerId: containerId },
        { status: false },
      );
    }
  },
);
