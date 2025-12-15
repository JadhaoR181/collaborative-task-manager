import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

export const useTasks = (filters?: {
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const res = await api.get("/tasks", { params: filters });
      return res.data as Task[];
    }
  });
};
