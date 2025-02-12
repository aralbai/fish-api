import express from "express";
import {
  addPurchase,
  deletePurchase,
  editPurchase,
  getPurchases,
} from "../controllers/purchases.js";

const router = express.Router();

router.get("/", getPurchases);

router.post("/", addPurchase);

router.put("/:id", editPurchase);

router.delete("/:id", deletePurchase);

export default router;
