import express from "express";
import {
  addPurchase,
  deletePurchase,
  editPurchase,
  editPurchaseShortage,
  getActivePurchases,
  getPurchase,
  getPurchases,
  getPurchasesQuery,
  getSingleSupplierDebtPurchases,
  getSingleSupplierPurchases,
  getTotalAmount,
  getTotalPrice,
} from "../controllers/purchases.js";

const router = express.Router();

router.get("/total/price", getTotalPrice);

router.get("/total/amount", getTotalAmount);

router.get("/single/debts/:supplierId", getSingleSupplierDebtPurchases);

router.get("/supplier/purchases/:supplierId", getSingleSupplierPurchases);

router.get("/active", getActivePurchases);

router.get("/query", getPurchasesQuery);

router.get("/:id", getPurchase);

router.get("/", getPurchases);

router.post("/", addPurchase);

router.put("/shortage/:id", editPurchaseShortage);

router.put("/:id", editPurchase);

router.delete("/:id", deletePurchase);

export default router;
