import { checkOverdueTasks } from "../services/taskOverdue.service";
import prisma from "../utils/prisma";

// 👇 mock prisma
jest.mock("../utils/prisma", () => require("./__mocks__/prisma"));

describe("Overdue Task Notification", () => {
  it("should notify only unnotified overdue tasks", async () => {
    //  Fake overdue task
    (prisma.task.findMany as jest.Mock).mockResolvedValue([
      {
        id: "task1",
        title: "Overdue Task",
        assignedToId: "user2"
      }
    ]);

    (prisma.task.update as jest.Mock).mockResolvedValue({});

    //  Run cron logic
    await checkOverdueTasks();

    //  Assert notification flag update
    expect(prisma.task.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { overdueNotified: true }
      })
    );
  });
});
