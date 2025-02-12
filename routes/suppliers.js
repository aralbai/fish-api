import express from "express";
import {
  addSupplier,
  deleteSupplier,
  editSupplier,
  getSuppliers,
} from "../controllers/suppliers.js";

const router = express.Router();

router.get("/", getSuppliers);

router.post("/", addSupplier);

router.put("/:id", editSupplier);

router.delete("/:id", deleteSupplier);

export default router;
