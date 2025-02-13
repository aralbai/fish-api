import express from "express";
import {
  addPurchase,
  deletePurchase,
  editPurchase,
  getPurchase,
  getPurchases,
} from "../controllers/purchases.js";

const router = express.Router();

router.get("/:id", getPurchase);

router.get("/", getPurchases);

router.post("/", addPurchase);

router.put("/:id", editPurchase);

router.delete("/:id", deletePurchase);

export default router;
