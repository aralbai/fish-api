import expres from "express";
import { deleteUser, getUsers, login, register } from "../controllers/users.js";

const router = expres.Router();

router.get("/", getUsers);

router.post("/login", login);

router.post("/register", register);

router.delete("/:id", deleteUser);

export default router;
