import { signup, login, getMe } from "../../src/controllers/authController";
import { mockRequest, mockResponse } from "../setup";
import User from "../../src/models/User";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("Auth Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should return 400 if validation fails", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Invalid email" }],
      });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Invalid email" }],
      });
    });

    it("should return 400 if user already exists", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.body = {
        email: "test@example.com",
        password: "password123",
        firmName: "Test Firm",
      };

      (User.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
    });

    it("should create new user and return token", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.body = {
        email: "test@example.com",
        password: "password123",
        firmName: "Test Firm",
      };

      const mockUser = {
        id: "1",
        email: "test@example.com",
        firmName: "Test Firm",
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: "1",
        email: "test@example.com",
        firmName: "Test Firm",
        token: "mock-token",
      });
    });
  });

  describe("login", () => {
    it("should return 401 for invalid credentials", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const mockUser = {
        matchPassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
    });

    it("should return user data and token for valid credentials", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.body = {
        email: "test@example.com",
        password: "correctpassword",
      };

      const mockUser = {
        id: "1",
        email: "test@example.com",
        firmName: "Test Firm",
        matchPassword: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      await login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        id: "1",
        email: "test@example.com",
        firmName: "Test Firm",
        token: "mock-token",
      });
    });
  });

  describe("getMe", () => {
    it("should return 401 if not authenticated", async () => {
      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized",
      });
    });

    it("should return user profile for authenticated user", async () => {
      req.user = { id: "1" };
      const mockUser = {
        id: "1",
        email: "test@example.com",
        firmName: "Test Firm",
      };

      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await getMe(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("1", {
        attributes: { exclude: ["password"] },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: "1",
        email: "test@example.com",
        firmName: "Test Firm",
      });
    });

    it("should return 404 if user not found", async () => {
      req.user = { id: "1" };
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });
  });
});
