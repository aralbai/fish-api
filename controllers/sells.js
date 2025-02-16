import Sell from "../models/Sell.js";
import Custumer from "../models/Custumer.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const getSell = async (req, res) => {
  try {
    const sell = await Sell.find().sort({ createdAt: -1 });

    res.status(200).json(sell);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getSells = async (req, res) => {
  try {
    const sells = await Sell.find().sort({ createdAt: -1 });

    res.status(200).json(sells);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addSell = async (req, res) => {
  try {
    let data = req.body;

    // Check product id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.product)) {
      const product = await Product.findOne({ _id: req.body.product });

      data.product = product;
    } else {
      data.product = { title: req.body.product };
    }

    // Check custumer id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.custumer)) {
      const custumer = await Custumer.findOne({ _id: req.body.custumer });

      data.custumer = custumer;
    } else {
      data.custumer = { fullname: req.body.custumer };
    }

    const newSell = new Sell(data);

    await newSell.save();

    res.status(201).json("Продажа добавлена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editSell = async (req, res) => {
  try {
    await Sell.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Продажа изменена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteSell = async (req, res) => {
  try {
    await Sell.findByIdAndDelete(req.params.id);

    res.status(200).json("Продажа удалена!");
  } catch (err) {
    res.status(500).json(err);
  }
};
