import { errorHandler } from "../../src/middleware/errorHandler";
import { mockRequest, mockResponse } from "../setup";

describe("Error Handler Middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should handle error with status code", () => {
    const error = new Error("Test error") as any;
    error.statusCode = 400;

    errorHandler(error, req, res, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Test error",
      stack: expect.any(String),
    });
  });

  it("should use default status code 500 if not provided", () => {
    const error = new Error("Server error");

    errorHandler(error, req, res, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Server error",
      stack: expect.any(String),
    });
  });

  it("should use default message if not provided", () => {
    const error = new Error() as any;
    error.statusCode = 500;

    errorHandler(error, req, res, next);

    expect(console.error).toHaveBeenCalledWith(error.stack);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Server Error",
      stack: expect.any(String),
    });
  });

  it("should hide stack trace in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const error = new Error("Test error");
    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: "Test error",
      stack: "🥞",
    });

    process.env.NODE_ENV = originalEnv;
  });
});
