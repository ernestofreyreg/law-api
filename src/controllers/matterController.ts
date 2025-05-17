import { Response } from "express";
import { validationResult } from "express-validator";
import Matter from "../models/Matter";
import Customer from "../models/Customer";
import { UserRequest } from "../types";

// @desc    Get matters for a customer
// @route   GET /api/customers/:customerId/matters
// @access  Private
export const getMatters = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customerId = req.params.customerId;

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const matters = await Matter.findAll({
      where: { customerId },
      order: [["createdAt", "DESC"]],
    });

    res.json(matters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new matter for a customer
// @route   POST /api/customers/:customerId/matters
// @access  Private
export const createMatter = async (req: UserRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customerId = req.params.customerId;

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const { name, description, status, practiceArea } = req.body;

    const matter = await Matter.create({
      name,
      description,
      status: status || "Open",
      openDate: new Date(),
      practiceArea,
      customerId,
    });

    res.status(201).json(matter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get matter details
// @route   GET /api/customers/:customerId/matters/:matterId
// @access  Private
export const getMatterById = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customerId = req.params.customerId;
    const matterId = req.params.matterId;

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const matter = await Matter.findOne({
      where: {
        id: matterId,
        customerId,
      },
    });

    if (!matter) {
      return res.status(404).json({ message: "Matter not found" });
    }

    res.json(matter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a matter
// @route   PUT /api/customers/:customerId/matters/:matterId
// @access  Private
export const updateMatter = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customerId = req.params.customerId;
    const matterId = req.params.matterId;

    // Check if customer exists and belongs to user
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const matter = await Matter.findOne({
      where: {
        id: matterId,
        customerId,
      },
    });

    if (!matter) {
      return res.status(404).json({ message: "Matter not found" });
    }

    const { name, description, status, practiceArea, openDate, closeDate } =
      req.body;

    matter.name = name || matter.name;
    matter.description = description || matter.description;
    matter.status = status || matter.status;
    matter.practiceArea = practiceArea || matter.practiceArea;
    matter.openDate = openDate || matter.openDate;
    matter.closeDate = closeDate || matter.closeDate;

    await matter.save();

    res.json(matter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
