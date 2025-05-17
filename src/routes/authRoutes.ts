import express from "express";
import { body } from "express-validator";
import * as authController from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("firmName").not().isEmpty().withMessage("Firm name is required"),
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  authController.login
);

router.get("/me", protect, authController.getMe);

export default router;
