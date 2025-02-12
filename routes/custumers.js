import express from "express";
import {
  addCustumer,
  deleteCustumer,
  editCustumer,
  getCustumers,
} from "../controllers/custumers.js";

const router = express.Router();

router.get("/", getCustumers);

router.post("/", addCustumer);

router.put("/:id", editCustumer);

router.delete("/:id", deleteCustumer);

export default router;
