import express from "express";
import {
  addSell,
  deleteSell,
  editSell,
  editSellRepays,
  getDebtSells,
  getSell,
  getSells,
  getSellsQuery,
  getTotalDebts,
  getTotalSells,
} from "../controllers/sells.js";

const router = express.Router();

router.get("/debt", getDebtSells);

router.get("/total/debts", getTotalDebts);

router.get("/total", getTotalSells);

router.get("/query", getSellsQuery);

router.get("/:id", getSell);

router.get("/", getSells);

router.post("/", addSell);

router.put("/repay/:id", editSellRepays);

router.put("/:id", editSell);

router.delete("/:id", deleteSell);

export default router;
