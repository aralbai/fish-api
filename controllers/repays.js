import Repay from "../models/Repay.js";
import Sell from "../models/Sell.js";

// Get only single sell repays
export const getOnlySingleSellRepays = async (req, res) => {
  try {
    const repays = await Repay.find({ sellId: req.params.sellId }).sort({
      createdAt: -1,
    });

    res.status(200).json(repays);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add repay
export const addRepay = async (req, res) => {
  try {
    const updatedSell = await Sell.findByIdAndUpdate(
      req.body.sellId,
      { $inc: { debt: -req.body.amount, given: req.body.amount } },
      { new: true, runValidators: true }
    );

    if (!updatedSell) {
      return res.status(400).json("Sell not found!");
    }

    const data = {
      sellId: req.body.sellId,
      amount: parseFloat(req.body.amount),
      addedDate: new Date(req.body.addedDate),
      addedUserId: req.body.addedUserId,
    };

    const newRepay = new Repay(data);

    await newRepay.save();

    res.status(200).json("Оплата принят!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete repay
export const deleteRepay = async (req, res) => {
  try {
    const repay = await Repay.findOne({ _id: req.params.repayId });

    if (!repay) {
      return res.status(400).json("Repay not found!");
    }

    console.log(repay.amount + repay.amount);

    const updatedSell = await Sell.findByIdAndUpdate(
      req.params.sellId,
      { $inc: { debt: repay?.amount, given: -repay?.amount } },
      { new: true, runValidators: true }
    );

    if (!updatedSell) {
      return res.status(400).json("Sell not found!");
    }

    await Repay.findByIdAndDelete(req.params.repayId);

    res.status(200).json("Платеж удален!!");
  } catch (err) {
    res.status(500).json(err);
  }
};
