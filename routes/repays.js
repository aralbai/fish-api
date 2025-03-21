import express from "express";
import {
  addRepay,
  deleteRepay,
  getOnlySingleSellRepays,
} from "../controllers/repays.js";

const router = express.Router();

router.get("/:sellId", getOnlySingleSellRepays);

router.post("/", addRepay);

router.put("/:id");

router.delete("/:sellId/:repayId", deleteRepay);

export default router;
