import { Response } from "express";
import { validationResult } from "express-validator";
import Customer from "../models/Customer";
import { UserRequest } from "../types";

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customers = await Customer.findAll({
      where: { userId: req.user.id },
      order: [["name", "ASC"]],
    });

    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req: UserRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, phoneNumber, email, address, notes } = req.body;

    const customer = await Customer.create({
      name,
      phoneNumber,
      email,
      address,
      notes,
      userId: req.user.id,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
export const getCustomerById = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req: UserRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const { name, phoneNumber, email, address, notes } = req.body;

    customer.name = name || customer.name;
    customer.phoneNumber = phoneNumber || customer.phoneNumber;
    customer.email = email || customer.email;
    customer.address = address || customer.address;
    customer.notes = notes || customer.notes;

    await customer.save();

    res.json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req: UserRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const customer = await Customer.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.destroy();

    res.json({ message: "Customer removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
