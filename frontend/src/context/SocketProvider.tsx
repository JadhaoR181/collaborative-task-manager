import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = io(import.meta.env.VITE_BACKEND_URL.replace("/api", ""), {
      withCredentials: true,
      auth: {
        userId: user.id
      },
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", err => {
      console.error("❌ Socket connect error:", err.message);
    });

    socket.on("task:assigned", data => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success(data?.message || "New task assigned");
    });

    socket.on("task:updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });
    socket.on("task:completed", ({ message }) => {
  toast.success(message);
 queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
});


    return () => {
      socket.disconnect();
    };
  }, [user, queryClient]);

  return <>{children}</>;
};
