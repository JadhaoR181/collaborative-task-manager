import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data as Notification[];
    }
  });
};
