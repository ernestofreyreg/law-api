import {
  getCustomers,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../../src/controllers/customerController";
import { mockRequest, mockResponse } from "../setup";
import Customer from "../../src/models/Customer";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("Customer Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("getCustomers", () => {
    it("should return 401 if not authenticated", async () => {
      await getCustomers(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized",
      });
    });

    it("should return all customers for authenticated user", async () => {
      req.user = { id: "1" };
      const mockCustomers = [
        { id: "1", name: "Customer 1" },
        { id: "2", name: "Customer 2" },
      ];

      (Customer.findAll as jest.Mock).mockResolvedValue(mockCustomers);

      await getCustomers(req, res);

      expect(Customer.findAll).toHaveBeenCalledWith({
        where: { userId: "1" },
        order: [["name", "ASC"]],
      });
      expect(res.json).toHaveBeenCalledWith(mockCustomers);
    });
  });

  describe("createCustomer", () => {
    it("should return 400 if validation fails", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Name is required" }],
      });

      await createCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Name is required" }],
      });
    });

    it("should create new customer for authenticated user", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.user = { id: "1" };
      req.body = {
        name: "New Customer",
        phoneNumber: "1234567890",
        email: "customer@example.com",
        address: "123 Main St",
        notes: "Test notes",
      };

      const mockCustomer = {
        id: "1",
        ...req.body,
        userId: "1",
      };

      (Customer.create as jest.Mock).mockResolvedValue(mockCustomer);

      await createCustomer(req, res);

      expect(Customer.create).toHaveBeenCalledWith({
        ...req.body,
        userId: "1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });
  });

  describe("getCustomerById", () => {
    it("should return 404 if customer not found", async () => {
      req.user = { id: "1" };
      req.params = { id: "999" };

      (Customer.findOne as jest.Mock).mockResolvedValue(null);

      await getCustomerById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
      });
    });

    it("should return customer if found", async () => {
      req.user = { id: "1" };
      req.params = { id: "1" };

      const mockCustomer = {
        id: "1",
        name: "Test Customer",
        userId: "1",
      };

      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

      await getCustomerById(req, res);

      expect(Customer.findOne).toHaveBeenCalledWith({
        where: {
          id: "1",
          userId: "1",
        },
      });
      expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });
  });

  describe("updateCustomer", () => {
    it("should return 404 if customer not found", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.user = { id: "1" };
      req.params = { id: "999" };
      req.body = { name: "Updated Name" };

      (Customer.findOne as jest.Mock).mockResolvedValue(null);

      await updateCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
      });
    });

    it("should update customer if found", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.user = { id: "1" };
      req.params = { id: "1" };
      req.body = { name: "Updated Name" };

      const mockCustomer = {
        id: "1",
        name: "Original Name",
        userId: "1",
        save: jest.fn().mockResolvedValue(true),
      };

      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

      await updateCustomer(req, res);

      expect(mockCustomer.name).toBe("Updated Name");
      expect(mockCustomer.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockCustomer);
    });
  });

  describe("deleteCustomer", () => {
    it("should return 404 if customer not found", async () => {
      req.user = { id: "1" };
      req.params = { id: "999" };

      (Customer.findOne as jest.Mock).mockResolvedValue(null);

      await deleteCustomer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
      });
    });

    it("should delete customer if found", async () => {
      req.user = { id: "1" };
      req.params = { id: "1" };

      const mockCustomer = {
        id: "1",
        userId: "1",
        destroy: jest.fn().mockResolvedValue(true),
      };

      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

      await deleteCustomer(req, res);

      expect(mockCustomer.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer removed",
      });
    });
  });
});
