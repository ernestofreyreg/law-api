import { Response } from "express";
import { UserRequest } from "../types";
import Customer from "../models/Customer";
import Matter from "../models/Matter";

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private
export const getStats = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customerCount = await Customer.count({
      where: {
        userId: req.user.id,
      },
    });

    const activeMattersCount = await Matter.count({
      include: [
        {
          model: Customer,
          where: { userId: req.user.id },
          attributes: [],
        },
      ],
      where: {
        status: ["open", "pending"],
      },
    });

    res.json({
      totalCustomers: customerCount,
      activeMatters: activeMattersCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
