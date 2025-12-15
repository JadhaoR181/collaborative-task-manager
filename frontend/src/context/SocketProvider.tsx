import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { SocketContext } from "./socket.context";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];

    const socket = io("http://localhost:5000", {
      auth: { token }
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:assigned", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  const getSocket = () => socketRef.current;

  return (
    <SocketContext.Provider value={{ getSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
