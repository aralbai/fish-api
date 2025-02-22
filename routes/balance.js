import express from "express";
import { addBalance, editBalance, getBalance } from "../controllers/balance.js";

const router = express.Router();

router.get("/", getBalance);

router.post("/", addBalance);

router.put("/", editBalance);

export default router;
