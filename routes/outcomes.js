import express from "express";
import {
  addOutcome,
  deleteOutcome,
  editOutcome,
  getOutcome,
  getOutcomes,
  getOutcomesQuery,
  getTotalOutcomes,
} from "../controllers/outcomes.js";

const router = express.Router();

router.get("/", getOutcomes);

router.get("/total", getTotalOutcomes);

router.get("/query", getOutcomesQuery);

router.get("/:id", getOutcome);

router.post("/", addOutcome);

router.put("/:id", editOutcome);

router.delete("/:id", deleteOutcome);

export default router;
