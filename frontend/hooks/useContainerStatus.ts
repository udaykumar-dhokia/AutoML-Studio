"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ContainerStatus {
  workflowId: string;
  containerId: string;
  status: "up" | "down";
}

export function useContainerStatus() {
  const [statuses, setStatuses] = useState<Record<string, ContainerStatus>>({});
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io("http://localhost:3000", { withCredentials: true });
    setSocket(s);

    s.on("container_added", (data: ContainerStatus) => {
      setStatuses((prev) => ({
        ...prev,
        [data.workflowId]: data,
      }));
    });

    s.on("container_removed", (data: ContainerStatus) => {
      setStatuses((prev) => ({
        ...prev,
        [data.workflowId]: { ...data, status: "down" },
      }));
    });

    return () => {
      s.disconnect();
    };
  }, []);

  return { statuses, socket };
}
