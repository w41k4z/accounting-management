import express from "express";
import multer from "multer";
import * as JournalCodeController from "../controllers/journalCode";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", JournalCodeController.create);
router.post("/upload", upload.single("csvFile"), JournalCodeController.upload);
router.post("/update", JournalCodeController.update);
router.post("/delete", JournalCodeController.remove);
router.post("/all-journal-code", JournalCodeController.get);

export default router;
