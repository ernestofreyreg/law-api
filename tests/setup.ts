import { Request, Response } from "express";
import { UserRequest } from "../src/types";

// Mock console methods
global.console = {
  ...console,
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock Sequelize
jest.mock("sequelize", () => {
  const actualSequelize = jest.requireActual("sequelize");
  return {
    ...actualSequelize,
    Sequelize: jest.fn(() => ({
      authenticate: jest.fn(),
      define: jest.fn(),
      sync: jest.fn(),
    })),
  };
});

// Mock Express Request
export const mockRequest = (overrides = {}) => {
  const req = {
    user: null,
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  } as unknown as UserRequest;
  return req;
};

// Mock Express Response
export const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

// Mock database models
jest.mock("../src/models/Customer", () => ({
  count: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock("../src/models/Matter", () => ({
  count: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock("../src/models/User", () => ({
  count: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
