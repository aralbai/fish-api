import express from "express";
import {
  addCustumer,
  deleteCustumer,
  editCustumer,
  editCustumerLimit,
  getCustumer,
  getCustumers,
} from "../controllers/custumers.js";

const router = express.Router();

router.get("/:id", getCustumer);

router.get("/", getCustumers);

router.post("/", addCustumer);

router.put("/limit/:id", editCustumerLimit);

router.put("/:id", editCustumer);

router.delete("/:id", deleteCustumer);

export default router;
