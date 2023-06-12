import express from "express";
import multer from "multer";
import * as ChartOfAccountController from "../controllers/chartOfAccount";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", ChartOfAccountController.create);
router.post("/delete", ChartOfAccountController.remove);
router.post("/update", ChartOfAccountController.update);
router.post(
  "/upload",
  upload.single("csvFile"),
  ChartOfAccountController.upload
);
router.post("/all-chart-of-account", ChartOfAccountController.get);

export default router;
