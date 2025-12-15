import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export const useNotifications = () =>
  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get("/notifications");
      return res.data;
    }
  });
