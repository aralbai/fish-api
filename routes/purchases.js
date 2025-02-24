import express from "express";
import {
  addPurchase,
  deletePurchase,
  editPurchase,
  getActivePurchases,
  getPurchase,
  getPurchases,
  getTotalAmount,
  getTotalPrice,
} from "../controllers/purchases.js";

const router = express.Router();

router.get("/total/price", getTotalPrice);

router.get("/total/amount", getTotalAmount);

router.get("/active", getActivePurchases);

router.get("/:id", getPurchase);

router.get("/", getPurchases);

router.post("/", addPurchase);

router.put("/:id", editPurchase);

router.delete("/:id", deletePurchase);

export default router;
