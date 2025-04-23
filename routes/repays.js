import express from "express";
import {
  addRepay,
  deleteRepay,
  getOnlySingleCustumerRepays,
} from "../controllers/repays.js";

const router = express.Router();

router.get("/:custumerId", getOnlySingleCustumerRepays);

router.post("/", addRepay);

router.put("/:id");

router.delete("/:sellId/:repayId", deleteRepay);

export default router;
