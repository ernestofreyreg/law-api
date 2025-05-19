import { getStats } from "../../src/controllers/statsController";
import { mockRequest, mockResponse } from "../setup";
import Customer from "../../src/models/Customer";
import Matter from "../../src/models/Matter";

describe("Stats Controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe("getStats", () => {
    it("should return 401 if user is not authenticated", async () => {
      await getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
    });

    it("should return correct stats for authenticated user", async () => {
      req.user = { id: "1" };
      (Customer.count as jest.Mock).mockResolvedValue(5);
      (Matter.count as jest.Mock).mockResolvedValue(3);

      await getStats(req, res);

      expect(Customer.count).toHaveBeenCalledWith({
        where: { userId: "1" },
      });
      expect(Matter.count).toHaveBeenCalledWith({
        include: [
          {
            model: Customer,
            where: { userId: "1" },
            attributes: [],
          },
        ],
        where: {
          status: ["open", "pending"],
        },
      });
      expect(res.json).toHaveBeenCalledWith({
        totalCustomers: 5,
        activeMatters: 3,
      });
    });

    it("should handle server errors", async () => {
      req.user = { id: "1" };
      const error = new Error("Database error");
      (Customer.count as jest.Mock).mockRejectedValue(error);

      await getStats(req, res);

      expect(console.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
