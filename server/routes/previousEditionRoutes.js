import express from "express";
import {
    createEdition,
    getEditions,
    getEditionByYear,
    updateEdition,
    deleteEdition,
} from "../controllers/previousEditionController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";
import imageUpload from "../middleware/imageUploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getEditions);
router.get("/:year", getEditionByYear);

// Admin routes
router.post(
    "/",
    authenticate,
    requireAdmin,
    imageUpload.array("images", 30), // Allow up to 30 images per upload
    createEdition
);

router.put(
    "/:id",
    authenticate,
    requireAdmin,
    imageUpload.array("newImages", 30), // Allow uploading additional images during edit
    updateEdition
);

router.delete("/:id", authenticate, requireAdmin, deleteEdition);

export default router;
