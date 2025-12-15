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

    const socket = io("http://localhost:5000", {
      withCredentials: true,
      auth: {
        userId: user.id
      },
      transports: ["websocket", "polling"] // 👈 IMPORTANT
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

    return () => {
      socket.disconnect();
    };
  }, [user, queryClient]);

  return <>{children}</>;
};
