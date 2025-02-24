import express from "express";
import {
  addWithdraw,
  deleteWithdraw,
  editWithdraw,
  getTotalWithdraws,
  getWithdraws,
} from "../controllers/withdraws.js";

const router = express.Router();

router.get("/total", getTotalWithdraws);

router.get("/", getWithdraws);

router.post("/", addWithdraw);

router.put("/:id", editWithdraw);

router.delete("/:id", deleteWithdraw);

export default router;
