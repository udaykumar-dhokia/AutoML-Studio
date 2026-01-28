import { createClient } from "redis";
import { io } from "../index";
import docker from "../config/docker.config";

const subscriber = createClient({ url: process.env.REDIS_URL });

subscriber.on("error", (err) => console.error("Redis Subscriber Error:", err));

await subscriber.connect();

await subscriber.configSet("notify-keyspace-events", "Khx");

await subscriber.pSubscribe(
  "__keyspace@0__:container:*",
  async (message, channel) => {
    const containerId = channel.split(":")[2];
    console.log(channel);

    if (message === "hset") {
      console.log(`Container added/updated: ${containerId}`);
      io.emit("container_added", {
        containerId,
        timestamp: Date.now(),
      });
    }

    if (message === "expired") {
      console.log(`Container expired/removed: ${containerId}`);
      await docker.getContainer(containerId).stop();
      io.emit("container_removed", {
        containerId,
        timestamp: Date.now(),
      });
    }
  },
);
