import express from "express";
import { body, param } from "express-validator";
import * as matterController from "../controllers/matterController";
import { protect } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

// Apply auth middleware to all routes
router.use(protect);

router
  .route("/")
  .get(
    param("customerId").isUUID().withMessage("Invalid customer ID"),
    matterController.getMatters
  )
  .post(
    [
      param("customerId").isUUID().withMessage("Invalid customer ID"),
      body("name").not().isEmpty().withMessage("Name is required"),
      body("description")
        .not()
        .isEmpty()
        .withMessage("Description is required"),
      body("practiceArea")
        .not()
        .isEmpty()
        .withMessage("Practice area is required"),
    ],
    matterController.createMatter
  );

router
  .route("/:matterId")
  .get(
    [
      param("customerId").isUUID().withMessage("Invalid customer ID"),
      param("matterId").isUUID().withMessage("Invalid matter ID"),
    ],
    matterController.getMatterById
  )
  .put(
    [
      param("customerId").isUUID().withMessage("Invalid customer ID"),
      param("matterId").isUUID().withMessage("Invalid matter ID"),
    ],
    matterController.updateMatter
  );

export default router;
