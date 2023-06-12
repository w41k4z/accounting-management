import express from "express";
import multer from "multer";
import * as JournalController from "../controllers/journal";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/create", JournalController.create);
// router.post("/delete", JournalController.remove);
// router.post("/update", JournalController.update);
router.post("/upload", upload.single("csvFile"), JournalController.upload);
router.post("/journals", JournalController.journals);
router.post("/all-journal", JournalController.get);

export default router;
