"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socket) {
      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
      socket = io(socketUrl, {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });
    }

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.IO server");
    });

    return () => {
      socket?.off("connect");
      socket?.off("connect_error");
      socket?.off("disconnect");
    };
  }, []);

  return socketRef.current;
}
