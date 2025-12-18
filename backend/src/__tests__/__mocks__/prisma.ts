const prisma = {
  task: {
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn()
  },
  notification: {
    create: jest.fn()
  }
};

export default prisma;
