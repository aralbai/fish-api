import expres from "express";
import { login, register } from "../controllers/users.js";

const router = expres.Router();

router.post("/login", login);

router.post("/register", register);

export default router;
