import { Request, Response } from "express";
import { getCurrentUser, updateProfile } from "../services/user.service";
import { updateProfileDto } from "../dtos/user.dto";

export const getMe = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await getCurrentUser(userId);
  res.status(200).json(user);
};

export const updateMe = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const validatedData = updateProfileDto.parse(req.body);

  const updatedUser = await updateProfile(userId, validatedData.name);
  res.status(200).json(updatedUser);
};
