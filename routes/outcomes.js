import express from "express";
import {
  addOutcome,
  deleteOutcome,
  editOutcome,
  getOutcomes,
  getOutcomesQuery,
  getTotalOutcomes,
} from "../controllers/outcomes.js";

const router = express.Router();

router.get("/total", getTotalOutcomes);

router.get("/", getOutcomes);

router.get("/query", getOutcomesQuery);

router.post("/", addOutcome);

router.put("/:id", editOutcome);

router.delete("/:id", deleteOutcome);

export default router;
