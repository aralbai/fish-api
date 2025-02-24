import express from "express";
import {
  addDeposit,
  deleteDeposit,
  editDeposit,
  getDeposits,
  getTotalDeposits,
} from "../controllers/deposits.js";

const router = express.Router();

router.get("/total", getTotalDeposits);

router.get("/", getDeposits);

router.post("/", addDeposit);

router.put("/:id", editDeposit);

router.delete("/:id", deleteDeposit);

export default router;
