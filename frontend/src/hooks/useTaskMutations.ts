import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { Task } from "./useTasks";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const res = await api.post("/tasks", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: Partial<Task>;
    }) => {
      const res = await api.put(`/tasks/${id}`, data);
      return res.data;
    },

    // ⭐ Optimistic Update
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks =
        queryClient.getQueryData<Task[]>(["tasks"]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(["tasks"], old =>
          old?.map(task =>
            task.id === id ? { ...task, ...data } : task
          )
        );
      }

      return { previousTasks };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  });
};
