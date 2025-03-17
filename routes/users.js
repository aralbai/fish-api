import expres from "express";
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getUsers,
  login,
  register,
  updateUser,
} from "../controllers/users.js";

const router = expres.Router();

router.get("/", getUsers);

router.get("/all", getAllUsers);

router.post("/login", login);

router.post("/register", register);

router.put("/:id", updateUser);

router.put("/password/:id", changePassword);

router.delete("/:id", deleteUser);

export default router;
