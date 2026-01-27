import { createClient } from "redis";
import { io } from "../index";

const subscriber = createClient({ url: process.env.REDIS_URL });

subscriber.on("error", (err) => console.error("Redis Subscriber Error:", err));

await subscriber.connect();

await subscriber.configSet("notify-keyspace-events", "Khx");

await subscriber.pSubscribe(
  "__keyspace@0__:container:*",
  (message, channel) => {
    const containerId = channel.split(":")[1];

    if (message === "hset") {
      console.log(`Container added/updated: ${containerId}`);
      io.emit("container_added", {
        containerId,
        timestamp: Date.now(),
      });
    }

    if (message === "expired") {
      console.log(`Container expired/removed: ${containerId}`);
      io.emit("container_removed", {
        containerId,
        timestamp: Date.now(),
      });
    }
  },
);
