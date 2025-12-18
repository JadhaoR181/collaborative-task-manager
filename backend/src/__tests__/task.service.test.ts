import { createNewTask, updateTask } from "../services/task.service";
import prisma from "../utils/prisma";


jest.mock("../utils/prisma", () => require("./__mocks__/prisma"));


// Test 1 = Task Creation testing
describe("Task Creation", () => {
  it("should create a task with correct creatorId", async () => {
    //  Fake DB response
    (prisma.task.create as jest.Mock).mockResolvedValue({
      id: "task1",
      title: "Test Task",
      creatorId: "user1"
    });

    //  Call real service function
    const task = await createNewTask("user1", {
      title: "Test Task",
      dueDate: "2025-01-01",
      priority: "HIGH",
      assignedToId: "user2"
    });

    //  Assertions
    expect(prisma.task.create).toHaveBeenCalled();
    expect(task.creatorId).toBe("user1");
  });
});

// Test 2 = Task Permission Rule testing
describe("Task Permission Rule", () => {
  it("should block non-assignee from updating status", async () => {
    //  Fake existing task
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({
      id: "task1",
      assignedToId: "user2",
      creatorId: "user1"
    });

    //  Attempt illegal update
    await expect(
      updateTask("task1", "user3", { status: "COMPLETED" })
    ).rejects.toThrow("Only assignee can update task status");
  });
});