import express from "express";
import { body, param } from "express-validator";
import * as customerController from "../controllers/customerController";
import { protect } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router
  .route("/")
  .get(customerController.getCustomers)
  .post(
    [
      body("name").not().isEmpty().withMessage("Name is required"),
      body("phoneNumber")
        .not()
        .isEmpty()
        .withMessage("Phone number is required"),
      body("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email"),
    ],
    customerController.createCustomer
  );

router
  .route("/:id")
  .get(
    param("id").isUUID().withMessage("Invalid customer ID"),
    customerController.getCustomerById
  )
  .put(
    [
      param("id").isUUID().withMessage("Invalid customer ID"),
      body("name").optional(),
      body("phoneNumber").optional(),
      body("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email"),
    ],
    customerController.updateCustomer
  )
  .delete(
    param("id").isUUID().withMessage("Invalid customer ID"),
    customerController.deleteCustomer
  );

export default router;
