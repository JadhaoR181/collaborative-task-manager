import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { SocketContext } from "./socket.context";
import toast from "react-hot-toast";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(import.meta.env.BACKEND_URL.replace("/api", ""), {
      withCredentials: true
    });

    socket.on("task:assigned", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("New task assigned");
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider
      value={{
        getSocket: () => socketRef.current
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
