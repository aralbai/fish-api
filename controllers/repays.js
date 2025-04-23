import mongoose from "mongoose";
import Repay from "../models/Repay.js";
import Sell from "../models/Sell.js";

// Get only single custumer repays
export const getOnlySingleCustumerRepays = async (req, res) => {
  try {
    const repays = await Repay.find({ custumerId: req.params.custumerId }).sort(
      {
        createdAt: -1,
      }
    );

    res.status(200).json(repays);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add repay
export const addRepay = async (req, res) => {
  const { custumerId, amount, addedUserId, addedDate } = req.body;

  if (amount <= 0) {
    return res.status(400).json({ message: "Summa 0 den ulken boliwi kerek!" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Jami qarzni hisoblaymiz
    const sells = await Sell.find({
      "custumer.id": custumerId,
      debt: { $gt: 0 },
    }).session(session);

    const totalDebt = sells.reduce((sum, sell) => sum + sell.debt, 0);

    if (amount > totalDebt) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Summa qarzlardan kobeyip ketti. Jami qarzlar: ${totalDebt}`,
      });
    }

    // 2. Repay ni saqlaymiz
    await new Repay({
      custumerId,
      amount,
      addedUserId,
      addedDate: new Date(addedDate),
    }).save({ session });

    // 3. Qarzlarni to'lash
    let remaining = amount;

    const sortedSells = sells.sort(
      (a, b) => new Date(a.addedDate) - new Date(b.addedDate)
    ); // manual sort

    for (let sell of sortedSells) {
      if (remaining <= 0) break;

      const canPay = Math.min(sell.debt, remaining);
      sell.given += canPay;
      sell.debt -= canPay;
      remaining -= canPay;

      await sell.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json("Tolem qabillandi");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ error: "Transaction failed, rolled back" });
  }
};

// Delete repay
export const deleteRepay = async (req, res) => {
  try {
    const repay = await Repay.findOne({ _id: req.params.repayId });

    if (!repay) {
      return res.status(400).json("Repay not found!");
    }

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
