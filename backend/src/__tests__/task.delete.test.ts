import { deleteTask } from "../services/task.service";
import prisma from "../utils/prisma";

jest.mock("../utils/prisma", () => require("./__mocks__/prisma"));

describe("Task Deletion Authorization", () => {
  it("should block non-creator from deleting task", async () => {
    //  Fake existing task
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: "task1",
      creatorId: "user1",
      assignedToId: "user2"
    });

    //  Attempt delete by non-creator
    await expect(
      deleteTask("task1", "user2")
    ).rejects.toThrow("Only creator can delete this task");
  });
});
