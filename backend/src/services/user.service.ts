import { ApiError } from "../utils/apiError";
import { findUserById, updateUserProfile, findAllUsers, getUsersExceptCurrent } from "../repositories/user.repository";

export const getCurrentUser = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const updateProfile = async (userId: string, name: string) => {
  if (!name || name.length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters");
  }

  return updateUserProfile(userId, name);
};

export const getAllUsers = async (currentUserId: string) => {
  return getUsersExceptCurrent(currentUserId);
};