import express from "express";
import multer from "multer";
import * as ThirdPartyChartOfAccountController from "../controllers/thirdPartyChartOfAccount";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", ThirdPartyChartOfAccountController.create);
router.post(
  "/upload",
  upload.single("csvFile"),
  ThirdPartyChartOfAccountController.upload
);
router.post("/update", ThirdPartyChartOfAccountController.update);
router.post("/delete", ThirdPartyChartOfAccountController.remove);
router.post(
  "/all-third-party-chart-of-account",
  ThirdPartyChartOfAccountController.get
);

export default router;
