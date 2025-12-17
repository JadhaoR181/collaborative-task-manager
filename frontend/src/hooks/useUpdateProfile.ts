import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import type { User } from "../types/user"; // create this type (shown below)

interface UpdateProfilePayload {
  name: string;
}

export const useUpdateProfile = () => {
  return useMutation<User, Error, UpdateProfilePayload>({
    mutationFn: async (payload) => {
      const { data } = await api.put<User>("/users/me", payload);
      return data;
    }
  });
};
