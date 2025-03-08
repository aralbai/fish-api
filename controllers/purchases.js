import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import mongoose from "mongoose";

// Get one purchase with _id
export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id });

    res.status(200).json(purchase);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get total price of purchases
export const getTotalPrice = async (req, res) => {
  try {
    const totalPurchases = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    res.json({ totalPurchases: totalPurchases[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total amount of purchases
export const getTotalAmount = async (req, res) => {
  try {
    const totalPurchases = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$remainingAmount" },
        },
      },
    ]);

    res.json({ totalAmount: totalPurchases[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active purchases (remainingAmount > 0)
export const getActivePurchases = async (req, res) => {
  try {
    const activePurchases = await Purchase.find({
      remainingAmount: { $gt: 0 },
    });

    res.status(200).json(activePurchases);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Get all purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add new  purchase
export const addPurchase = async (req, res) => {
  try {
    let data = req.body;

    // Check product id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.product)) {
      const product = await Product.findOne({ _id: req.body.product });

      data.product = product;
    } else {
      return res.status(400).json("Product not found!");
    }

    // Check custumer id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.supplier)) {
      const supplier = await Supplier.findOne({ _id: req.body.supplier });

      data.supplier = supplier;
    } else {
      return res.status(400).json("Supplier not found!");
    }

    const newPurchase = new Purchase(req.body);

    await newPurchase.save();

    res.status(201).json("Покупка добавлена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit purchase
export const editPurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json("Покупка изменена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit purchase with shortage
export const editPurchaseShortage = async (req, res) => {
  try {
    const id = req.params.id;
    const shortage = req.body.shortage;

    await Purchase.findByIdAndUpdate(
      id,
      {
        $inc: { shortage: shortage, remainingAmount: -shortage },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json("Покупка изменена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete purchase
export const deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);

    res.status(200).json("Покупка удалена!");
  } catch (err) {
    res.status(500).json(err);
  }
};
