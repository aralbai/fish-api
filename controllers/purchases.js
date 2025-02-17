import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import mongoose from "mongoose";

export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id });

    res.status(200).json(purchase);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Getting remainingAmount > 0 values
export const getActivePurchases = async (req, res) => {
  console.log(req.body);
  try {
    const purchases = await Purchase.find({ remainingAmount: { $gt: 0 } }).sort(
      {
        createdAt: -1,
      }
    );

    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addPurchase = async (req, res) => {
  console.log(req.body);
  try {
    let data = req.body;

    // Check product id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.product)) {
      const product = await Product.findOne({ _id: req.body.product });

      data.product = product;
    } else {
      console.log(req.body);
    }

    // Check custumer id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.supplier)) {
      const supplier = await Supplier.findOne({ _id: req.body.supplier });

      data.supplier = supplier;
    } else {
      data.supplier = { title: req.body.supplier };
    }

    const newPurchase = new Purchase(req.body);

    await newPurchase.save();

    res.status(201).json("Покупка добавлена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editPurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Покупка изменена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);

    res.status(200).json("Покупка удалена!");
  } catch (err) {
    res.status(500).json(err);
  }
};
