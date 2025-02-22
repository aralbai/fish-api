import express from "express";
import {
  addOutcome,
  deleteOutcome,
  editOutcome,
  getOutcomes,
} from "../controllers/outcomes.js";

const router = express.Router();

router.get("/", getOutcomes);

router.post("/", addOutcome);

router.put("/:id", editOutcome);

router.delete("/:id", deleteOutcome);

export default router;
