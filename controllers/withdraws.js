import Withdraw from "../models/Withdraw.js";

export const getWithdraw = async (req, res) => {
  try {
    const withdraw = await Withdraw.findOne({ _id: req.params.id });

    res.status(200).json(withdraw);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });

    res.status(200).json(withdraws);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addWithdraw = async (req, res) => {
  try {
    const newWithdraw = new Withdraw(req.body);

    await newWithdraw.save();

    res.status(201).json("Депозит добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editWithdraw = async (req, res) => {
  try {
    await Withdraw.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Депозит изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteWithdraw = async (req, res) => {
  try {
    await Withdraw.findByIdAndDelete(req.params.id);

    res.status(200).json("Депозит удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
