import { protect } from "../../src/middleware/auth";
import { mockRequest, mockResponse } from "../setup";
import User from "../../src/models/User";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("protect", () => {
    it("should return 401 if no token provided", async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized, no token provided",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      req.headers = {
        authorization: "Bearer invalid-token",
      };

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      await protect(req, res, next);

      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized, invalid token",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if user not found", async () => {
      req.headers = {
        authorization: "Bearer valid-token",
      };

      const decodedToken = { id: 1 };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized, user not found",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should set user in request and call next if token is valid", async () => {
      req.headers = {
        authorization: "Bearer valid-token",
      };

      const decodedToken = { id: 1 };
      const mockUser = {
        id: 1,
        email: "test@example.com",
        firmName: "Test Firm",
      };

      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      await protect(req, res, next);

      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ["password"] },
      });
      expect(req.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firmName: mockUser.firmName,
      });
      expect(next).toHaveBeenCalled();
    });
  });
});
