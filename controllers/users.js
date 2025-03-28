import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        fullname: user.fullname,
        email: user.email,
      },
      message: "Login succesfully!",
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Register
export const register = async (req, res) => {
  try {
    const { fullname, email, username, password, role } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get users without superadmin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "superadmin" } }).sort({
      createdAt: -1,
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
// Update user
export const updateUser = async (req, res) => {
  try {
    const { fullname, username, password, role } = req.body;

    let data = {
      fullname,
      username,
      role,
    };

    if (password) {
      const hashedNewPassword = await bcrypt.hash(password, 10);

      data.password = hashedNewPassword;
    }

    await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: data,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json("User has been updated!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { username, password, newPassword } = req.body;

    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { password: hashedPassword },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json("User has been updated!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json("User has been deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
};
