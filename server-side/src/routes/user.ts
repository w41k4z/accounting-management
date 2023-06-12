import express from "express";
import * as UserAccountController from "../controllers/user";

// This do not create a new instance of express, but use the one from server.ts
const router = express.Router();

router.post("/sign-in", UserAccountController.signIn);
router.post("/create", UserAccountController.create);
router.post("/user", UserAccountController.getUserByID);

export default router;
