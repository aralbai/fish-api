import express from "express";
import {
  addDeposit,
  deleteDeposit,
  editDeposit,
  getDeposit,
  getDeposits,
  getTotalDeposits,
} from "../controllers/deposits.js";

const router = express.Router();

router.get("/", getDeposits);

router.get("/total", getTotalDeposits);

router.get("/:id", getDeposit);

router.post("/", addDeposit);

router.put("/:id", editDeposit);

router.delete("/:id", deleteDeposit);

export default router;
