import express from "express";
import multer from "multer";
import * as ReferenceDocumentController from "../controllers/referenceDocument";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", ReferenceDocumentController.create);
router.post(
  "/upload",
  upload.single("csvFile"),
  ReferenceDocumentController.upload
);
router.post("/update", ReferenceDocumentController.update);
router.post("/delete", ReferenceDocumentController.remove);
router.post("/all-reference-document", ReferenceDocumentController.get);

export default router;
