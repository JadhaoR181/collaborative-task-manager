import { Request, Response } from "express";
import { createTaskDto, updateTaskDto } from "../dtos/task.dto";
import {
  createNewTask,
  deleteTask,
  getUserTasks,
  updateTask
} from "../services/task.service";

export const createTaskHandler = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const data = createTaskDto.parse(req.body);

  const task = await createNewTask(userId, data);
  res.status(201).json(task);
};

export const getTasksHandler = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const tasks = await getUserTasks(userId, req.query);
  res.status(200).json(tasks);
};

export const updateTaskHandler = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const taskId = req.params.id;
  const data = updateTaskDto.parse(req.body);

  const task = await updateTask(taskId, userId, data);
  res.status(200).json(task);
};

export const deleteTaskHandler = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const taskId = req.params.id;

  await deleteTask(taskId, userId);
  res.status(204).send();
};
