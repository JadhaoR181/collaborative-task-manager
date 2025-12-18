jest.mock("../utils/prisma", () => {
  return {
    __esModule: true,
    default: require("./__mocks__/prisma").default
  };
});

process.env.NODE_ENV = "test";

// Mock Socket.io
jest.mock("../server", () => ({
  io: {
    to: () => ({
      emit: jest.fn()
    })
  }
}));

// Mock notifications
jest.mock("../repositories/notification.repository", () => ({
  createNotification: jest.fn()
}));
