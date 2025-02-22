import express from "express";
import {
  addDeposit,
  deleteDeposit,
  editDeposit,
  getDeposits,
} from "../controllers/deposits.js";
import { balance } from "../middlewares/balance.js";

const router = express.Router();

router.get("/", getDeposits);

router.post("/", balance, addDeposit);

router.put("/:id", editDeposit);

router.delete("/:id", balance, deleteDeposit);

export default router;
