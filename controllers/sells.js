import Sell from "../models/Sell.js";

export const getSells = async (req, res) => {
  try {
    const sells = await Sell.find();

    res.status(200).json(sells);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addSell = async (req, res) => {
  try {
    const newSell = new Sell(req.body);

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
