import express from "express";
import * as SocietyController from "../controllers/society";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();

router.post("/authenticate", SocietyController.authenticate);
router.post("/create", SocietyController.create);
router.post("/update", SocietyController.update);
router.post("/prod", SocietyController.dev);

export default router;
