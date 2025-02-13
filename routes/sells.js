import express from "express";
import {
  addSell,
  deleteSell,
  editSell,
  getSell,
  getSells,
} from "../controllers/sells.js";

const router = express.Router();

router.get("/:id", getSell);

router.get("/", getSells);

router.post("/", addSell);

router.put("/:id", editSell);

router.delete("/:id", deleteSell);

export default router;
