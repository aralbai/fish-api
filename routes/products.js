import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProducts,
} from "../controllers/products.js";

const router = express.Router();

router.get("/:id", getProduct);

router.get("/", getProducts);

router.post("/", addProduct);

router.put("/:id", editProduct);

router.delete("/:id", deleteProduct);

export default router;
