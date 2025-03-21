import express from "express";
import {
  addWithdraw,
  deleteWithdraw,
  editWithdraw,
  getTotalWithdraws,
  getWithdraw,
  getWithdraws,
} from "../controllers/withdraws.js";

const router = express.Router();

router.get("/", getWithdraws);

router.get("/total", getTotalWithdraws);

router.get("/:id", getWithdraw);

router.post("/", addWithdraw);

router.put("/:id", editWithdraw);

router.delete("/:id", deleteWithdraw);

export default router;
