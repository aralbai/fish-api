import express from "express";
import {
  addProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "../controllers/products.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", addProduct);

router.put("/:id", editProduct);

router.delete("/:id", deleteProduct);

export default router;
