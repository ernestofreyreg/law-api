import {
  getMatters,
  createMatter,
  getMatterById,
  updateMatter,
} from "../../src/controllers/matterController";
import { mockRequest, mockResponse } from "../setup";
import Matter from "../../src/models/Matter";
import Customer from "../../src/models/Customer";

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("Matter Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("getMatters", () => {
    it("should return 401 if not authenticated", async () => {
      await getMatters(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Not authorized",
      });
    });

    it("should return 404 if customer not found", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "999" };

      (Customer.findOne as jest.Mock).mockResolvedValue(null);

      await getMatters(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
      });
    });

    it("should return matters for valid customer", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "1" };

      const mockCustomer = { id: "1", userId: "1" };
      const mockMatters = [
        { id: "1", name: "Matter 1" },
        { id: "2", name: "Matter 2" },
      ];

      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (Matter.findAll as jest.Mock).mockResolvedValue(mockMatters);

      await getMatters(req, res);

      expect(Matter.findAll).toHaveBeenCalledWith({
        where: { customerId: "1" },
        order: [["createdAt", "DESC"]],
      });
      expect(res.json).toHaveBeenCalledWith(mockMatters);
    });
  });

  describe("createMatter", () => {
    it("should return 400 if validation fails", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Name is required" }],
      });

      await createMatter(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ msg: "Name is required" }],
      });
    });

    it("should return 404 if customer not found", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.user = { id: "1" };
      req.params = { customerId: "999" };
      req.body = {
        name: "New Matter",
        description: "Test description",
        practiceArea: "Criminal",
      };

      (Customer.findOne as jest.Mock).mockResolvedValue(null);

      await createMatter(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
      });
    });

    it("should create new matter for valid customer", async () => {
      const { validationResult } = require("express-validator");
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      req.user = { id: "1" };
      req.params = { customerId: "1" };
      req.body = {
        name: "New Matter",
        description: "Test description",
        practiceArea: "Criminal",
      };

      const mockCustomer = { id: "1", userId: "1" };
      const mockMatter = {
        id: "1",
        ...req.body,
        status: "Open",
        customerId: "1",
      };

      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (Matter.create as jest.Mock).mockResolvedValue(mockMatter);

      await createMatter(req, res);

      expect(Matter.create).toHaveBeenCalledWith({
        ...req.body,
        status: "Open",
        openDate: expect.any(Date),
        customerId: "1",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockMatter);
    });
  });

  describe("getMatterById", () => {
    it("should return 404 if customer not found", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "999", matterId: "1" };

      (Customer.findOne as jest.Mock).mockResolvedValue(null);

      await getMatterById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
      });
    });

    it("should return 404 if matter not found", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "1", matterId: "999" };

      const mockCustomer = { id: "1", userId: "1" };
      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (Matter.findOne as jest.Mock).mockResolvedValue(null);

      await getMatterById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Matter not found",
      });
    });

    it("should return matter if found", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "1", matterId: "1" };

      const mockCustomer = { id: "1", userId: "1" };
      const mockMatter = {
        id: "1",
        name: "Test Matter",
        customerId: "1",
      };

      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (Matter.findOne as jest.Mock).mockResolvedValue(mockMatter);

      await getMatterById(req, res);

      expect(Matter.findOne).toHaveBeenCalledWith({
        where: {
          id: "1",
          customerId: "1",
        },
      });
      expect(res.json).toHaveBeenCalledWith(mockMatter);
    });
  });

  describe("updateMatter", () => {
    it("should return 404 if customer not found", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "999", matterId: "1" };
      req.body = { name: "Updated Matter" };

      (Customer.findOne as jest.Mock).mockResolvedValue(null);

      await updateMatter(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Customer not found",
      });
    });

    it("should return 404 if matter not found", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "1", matterId: "999" };
      req.body = { name: "Updated Matter" };

      const mockCustomer = { id: "1", userId: "1" };
      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (Matter.findOne as jest.Mock).mockResolvedValue(null);

      await updateMatter(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Matter not found",
      });
    });

    it("should update matter if found", async () => {
      req.user = { id: "1" };
      req.params = { customerId: "1", matterId: "1" };
      req.body = {
        name: "Updated Matter",
        description: "Updated description",
        status: "Closed",
        practiceArea: "Civil",
        closeDate: new Date(),
      };

      const mockCustomer = { id: "1", userId: "1" };
      const mockMatter = {
        id: "1",
        name: "Original Matter",
        description: "Original description",
        status: "Open",
        practiceArea: "Criminal",
        customerId: "1",
        closeDate: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };

      (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);
      (Matter.findOne as jest.Mock).mockResolvedValue(mockMatter);

      await updateMatter(req, res);

      expect(mockMatter.name).toBe("Updated Matter");
      expect(mockMatter.description).toBe("Updated description");
      expect(mockMatter.status).toBe("Closed");
      expect(mockMatter.practiceArea).toBe("Civil");
      expect(mockMatter.closeDate).toBe(req.body.closeDate);
      expect(mockMatter.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockMatter);
    });
  });
});
