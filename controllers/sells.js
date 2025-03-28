import mongoose from "mongoose";
import Sell from "../models/Sell.js";
import Purchase from "../models/Purchase.js";
import Repay from "../models/Repay.js";

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
    const { startDate, endDate } = req.query;

    if (startDate && endDate) {
      const totalSales = await Sell.aggregate([
        {
          $match: {
            addedDate: {
              $gte: new Date(startDate), // Start date (inclusive)
              $lte: new Date(endDate), // End date (inclusive)
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$given" },
          },
        },
      ]);

      return res.status(200).json({ totalSales: totalSales[0]?.total || 0 });
    }

    const totalSales = await Sell.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$given" },
        },
      },
    ]);

    res.status(200).json({ totalSales: totalSales[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sells
export const getAllSells = async (req, res) => {
  try {
    console.log(req.query);
    const { productId, custumerId, status, startDate, endDate } = req.query;

    let filter = {};

    if (startDate || endDate) {
      filter.addedDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (productId) {
      filter["product.id"] = productId;
    }

    if (custumerId) {
      filter["custumer.id"] = custumerId;
    }

    if (status) {
      if (status === "debts") {
        filter.debt = { $gt: 0 };
      }
    }

    const sells = await Sell.find(filter).sort({ addedDate: -1 });

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
      purchaseId: req.params.purchaseId,
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
      purchaseId: req.body.purchaseId,
      product: req.body.product,
      custumer: req.body.custumer,
      amount: parseFloat(req.body.amount),
      price: parseFloat(req.body.price),
      totalPrice:
        parseFloat(req.body.amount) * parseFloat(req.body.price) -
        parseFloat(req.body.discount),
      discount: parseFloat(req.body.discount),
      debt: parseFloat(req.body.debt),
      given:
        parseFloat(req.body.amount) * parseFloat(req.body.price) -
        parseFloat(req.body.discount) -
        parseFloat(req.body.debt),
      addedDate: new Date(req.body.addedDate),
      addedUserId: req.body.addedUserId,
    };

    // Check purchaseId is valid
    if (mongoose.Types.ObjectId.isValid(req.body.purchaseId)) {
      // Change purchase remaining amount
      await Purchase.findByIdAndUpdate(
        req.body.purchaseId,
        {
          $inc: { remainingAmount: -req.body.amount },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      return res.status(400).json("Purchase not found!");
    }

    const newSell = new Sell(data);

    await newSell.save();

    res.status(201).json("Продажа добавлена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit sell
export const editSell = async (req, res) => {
  try {
    const {
      custumer,
      addedDate,
      amount,
      price,
      discount,
      debt,
      changedUserId,
      purchaseId,
      prevAmount,
    } = req.body;

    const remaining = parseFloat(amount) - parseFloat(prevAmount);

    const data = {
      custumer,
      addedDate: new Date(addedDate),
      amount: parseFloat(amount),
      price: parseFloat(price),
      discount: parseFloat(discount),
      debt: parseFloat(debt),
      changedUserId,
      totalPrice: parseFloat(amount) * parseFloat(price) - parseFloat(discount),
      given:
        parseFloat(amount) * parseFloat(price) -
        parseFloat(discount) -
        parseFloat(debt),
    };

    const updatedSell = await Sell.findByIdAndUpdate(
      req.params.id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSell) {
      return res.stutus(400).json("Sell not found!");
    }

    await Purchase.findByIdAndUpdate(
      purchaseId,
      {
        $inc: { remainingAmount: -remaining },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json("Продажа изменена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete sell
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
    if (!mongoose.Types.ObjectId.isValid(sell.purchaseId)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Add deleting sell amount to purchase remainingAmount
    await Purchase.findByIdAndUpdate(sell.purchaseId, {
      $inc: { remainingAmount: sell.amount },
    });

    // Delete sell
    const deletedSell = await Sell.findByIdAndDelete(req.params.id);

    if (!deletedSell) {
      return res.status(400).json("Sell not found!");
    }

    await Repay.deleteMany({ sellId: id });

    res.status(200).json("Продажа удалена!");
  } catch (err) {
    res.status(500).json(err);
  }
};
