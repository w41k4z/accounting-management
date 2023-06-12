import express from "express";
import * as CurrencyController from "../controllers/currency";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();

router.post("/create", CurrencyController.create);
router.post("/update", CurrencyController.update);
router.post("/delete", CurrencyController.remove);

export default router;
