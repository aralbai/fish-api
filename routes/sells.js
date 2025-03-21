import express from "express";
import {
  addSell,
  deleteSell,
  editSell,
  getDebtSells,
  getSell,
  getSells,
  getSellsQuery,
  getSinglePurchaseSells,
  getSingleUserDebtSells,
  getTotalDebts,
  getTotalSells,
} from "../controllers/sells.js";

const router = express.Router();

router.get("/debt", getDebtSells);

router.get("/total/debts", getTotalDebts);

router.get("/total", getTotalSells);

router.get("/query", getSellsQuery);

router.get("/single/debts/:custumerId", getSingleUserDebtSells);

router.get("/single/purchase/:purchaseId", getSinglePurchaseSells);

router.get("/:id", getSell);

router.get("/", getSells);

router.post("/", addSell);

router.put("/:id", editSell);

router.delete("/:id", deleteSell);

export default router;
