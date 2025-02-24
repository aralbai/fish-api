import express from "express";
import {
  addSell,
  deleteSell,
  editSell,
  getDebtSells,
  getSell,
  getSells,
  getTotalSells,
} from "../controllers/sells.js";

const router = express.Router();

router.get("/debt", getDebtSells);

router.get("/total", getTotalSells);

router.get("/:id", getSell);

router.get("/", getSells);

router.post("/", addSell);

router.put("/:id", editSell);

router.delete("/:id", deleteSell);

export default router;
