"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:3000", {
        withCredentials: true,
      });
    }

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.IO server");
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
    };
  }, []);

  return socketRef.current;
}
