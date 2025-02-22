import express from "express";
import {
  addWithdraw,
  deleteWithdraw,
  editWithdraw,
  getWithdraws,
} from "../controllers/withdraws.js";

const router = express.Router();

router.get("/", getWithdraws);

router.post("/", addWithdraw);

router.put("/:id", editWithdraw);

router.delete("/:id", deleteWithdraw);

export default router;
