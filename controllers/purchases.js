import Purchase from "../models/Purchase.js";

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

export const addPurchase = async (req, res) => {
  console.log(req.body);
  try {
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
