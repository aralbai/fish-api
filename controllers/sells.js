import Sell from "../models/Sell.js";
import Custumer from "../models/Custumer.js";
import Product from "../models/Product.js";
import Purchase from "../models/Purchase.js";
import mongoose from "mongoose";

// Get only debt sells
export const getDebtSells = async (req, res) => {
  try {
    const debtSells = await Sell.find({ debt: { $gt: 0 } });

    res.json(debtSells);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get only single user debt sells
export const getSingleUserDebtSells = async (req, res) => {
  try {
    const purchaseSells = await Sell.find({
      debt: { $gt: 0 },
      "custumer.id": req.params.custumerId,
    }).sort({ createdAt: -1 });

    res.json(purchaseSells);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total debts
export const getTotalDebts = async (req, res) => {
  try {
    const totalDebts = await Sell.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$debt" },
        },
      },
    ]);

    res.json({ totalDebts: totalDebts[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single sell
export const getSell = async (req, res) => {
  try {
    const sell = await Sell.findOne({ _id: req.params.id });

    res.status(200).json(sell);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get total sells
export const getTotalSells = async (req, res) => {
  try {
    const totalSales = await Sell.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    res.json({ totalSales: totalSales[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sells
export const getSells = async (req, res) => {
  try {
    const sells = await Sell.find().sort({ createdAt: -1 });

    res.status(200).json(sells);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all sells with query
export const getSellsQuery = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const sells = await Sell.find({
      addedDate: {
        $gte: new Date(startDate), // Greater than or equal to startDate
        $lte: new Date(endDate), // Less than or equal to endDate
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(sells);
  } catch (err) {
    res.status(500).json(err);
  }
};

//Get only single purchase sells
export const getSinglePurchaseSells = async (req, res) => {
  try {
    console.log(req.params.purchaseId);

    const sells = await Sell.find({
      purchase: req.params.purchaseId,
    }).sort({ createdAt: -1 });

    res.status(200).json(sells);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add new sell
export const addSell = async (req, res) => {
  console.log(req.body);
  try {
    let data = {
      ...req.body,
      amount: parseFloat(req.body.amount),
      discount: parseFloat(req.body.discount),
      debt: parseFloat(req.body.debt),
      changedUserId: req.body.addedUserId,
    };

    // Check product id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.product)) {
      const product = await Product.findOne({ _id: req.body.product });

      data.product = {
        id: req.body.product,
        title: product?.title,
      };
    }

    // Check purchase id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.purchase)) {
      const purchase = await Purchase.findOne({ _id: req.body.purchase });

      if (purchase) {
        data.purchase = purchase;

        await Purchase.findByIdAndUpdate(req.body.purchase, {
          remainingAmount: purchase.remainingAmount - req.body.amount,
        });
      } else {
        return res.status(400).json("No purchase found!");
      }
    }

    // Check custumer id is valid
    if (mongoose.Types.ObjectId.isValid(req.body.custumer)) {
      const custumer = await Custumer.findOne({ _id: req.body.custumer });

      if (parseFloat(req.body.debt) > 0) {
        await Custumer.findByIdAndUpdate(req.body.custumer, {
          $inc: { debt: req.body.debt },
        });
      }

      data.custumer = { id: req.body.custumer, fullname: custumer?.fullname };
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

// Edit sell with repay debt
export const editSellRepays = async (req, res) => {
  try {
    const id = req.params.id;

    await Sell.findByIdAndUpdate(
      id,
      {
        $push: { repays: req.body }, // Add a new repayment
        $inc: { debt: -req.body.amount, given: req.body.amount }, // Reduce the debt
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json("Продажа изменена!");
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
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find document by _id
    const sell = await Sell.findOne({ _id: id });

    // check sell
    if (!sell) {
      return res.status(404).json({ error: "No sell found" });
    }

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(sell.purchase._id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Add deleting sell amount to purchase remainingAmount
    await Purchase.findByIdAndUpdate(sell.purchase._id, {
      $inc: { remainingAmount: sell.amount },
    });

    // Delete sell
    await Sell.findByIdAndDelete(req.params.id);

    res.status(200).json("Продажа удалена!");
  } catch (err) {
    res.status(500).json(err);
  }
};
