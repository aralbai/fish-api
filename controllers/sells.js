import mongoose from "mongoose";
import Sell from "../models/Sell.js";
import Purchase from "../models/Purchase.js";
import Repay from "../models/Repay.js";
import Custumer from "../models/Custumer.js";

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
    const { productId, custumerId, status, startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

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

    const total = await Sell.countDocuments(filter);

    const sells = await Sell.find(filter)
      .sort({ addedDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      totalPages: Math.ceil(total / limit),
      sells,
    });
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
  // Tranzaction session di init qiliw
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Purchase ti tabiw. Tabilmasa return qiliw
    const purchase = await Purchase.findById(req.body.purchaseId).session(
      session
    );

    if (!purchase) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Purchase tabilmadi!" });
    }

    // Product qaldiq mugdari satiw ushin jeterlime
    if (purchase.remainingAmount < req.body.amount * 1000) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: `Produkt jeterli emes! Maksimum ${
          purchase.remainingAmount / 1000
        }kg bar!`,
      });
    }

    //Klientt tabiw
    const custumer = await Custumer.findById(req.body.custumer.id);
    if (!custumer) {
      await session.abortTransaction();
      session.endSession();
      return res.statu(400).json({ message: "Klient tabilmadi" });
    }

    // Qarzdor sotuvlarni topish
    const custumerDebts = await Sell.find({
      "custumer.id": req.body.custumer.id,
      debt: { $gt: 0 },
    });

    // Qarzlarning jami summasini hisoblash
    const totalDebt = custumerDebts.reduce((sum, sell) => sum + sell.debt, 0);

    // Klient limiti menen qazrlarin salistirip koriw
    if (custumer.limit < totalDebt + req.body.debt) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Klient limiti: ${Intl.NumberFormat("uz-UZ")
          .format(custumer?.limit - totalDebt)
          .replace(/,/g, " ")}`,
      });
    }

    // Change purchase remaining amount
    await Purchase.findByIdAndUpdate(
      req.body.purchaseId,
      {
        remainingAmount: purchase.remainingAmount - req.body.amount * 1000,
      },
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    let data = {
      purchaseId: req.body.purchaseId,
      product: req.body.product,
      custumer: req.body.custumer,
      amount: parseFloat(req.body.amount * 1000),
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

    const newSell = new Sell(data);

    await newSell.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json("Продажа добавлена!");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json(err);
  }
};

// Edit sell
export const editSell = async (req, res) => {
  // Tranzaksiyani init qiliw
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Selldi tabiw. Tabilmasa return qiliw
    const sell = await Sell.findById(req.params.id).session(session);
    if (!sell) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json("Sell tabilmadi!");
    }

    // Purchase ti tabiw. Eger tabilmasa return qiliw
    const purchase = await Purchase.findById(sell.purchaseId).session(session);
    if (!purchase) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Purchase tabilmadi!" });
    }

    const newAmount = parseFloat(req.body.amount * 1000);
    const price = parseFloat(req.body.price);
    const discount = parseFloat(req.body.discount);
    const debt = parseFloat(req.body.debt);

    const expectedTotal = (newAmount / 1000) * price; // totalPrice formulasi

    // Discount tekshirish
    if (discount < 0 || discount > expectedTotal) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Skidka qate kiritildi! 0 ham ${Intl.NumberFormat("uz-UZ")
          .format(expectedTotal)
          .replace(/,/g, " ")} arasinda boliwi mumkin!`,
      });
    }

    // Debt va Given tekshirish
    const given = expectedTotal - discount - debt;
    if (given < 0 || debt < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Qarz qate kiritilgen. 0 ham ${Intl.NumberFormat("uz-UZ")
          .format(expectedTotal - discount)
          .replace(/,/g, " ")} arasinda boliwi mumkin!`,
      });
    }

    const oldAmount = sell.amount; // eski mugdari
    const difference = newAmount - oldAmount;

    // Taza purchase ushin remaining amount
    let newRemainingAmount = purchase.remainingAmount - difference;

    if (isNaN(newAmount) || isNaN(difference) || isNaN(newRemainingAmount)) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Esaplawdagi qatelik. Jaramsiz magliwmat!" });
    }

    // Tekshiruv: qoldiq salbiy bo‘lishi mumkin emas!
    if (newRemainingAmount < 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: `Produkt jeterli emes! Maksimum ${
          purchase.remainingAmount / 1000
        }kg bar!`,
      });
    }

    // Update Purchase
    await Purchase.findByIdAndUpdate(
      sell.purchaseId,
      { $set: { remainingAmount: newRemainingAmount } },
      { new: true, runValidators: true, session }
    );

    const data = {
      custumer: req.body.custumer,
      addedDate: new Date(req.body.addedDate),
      amount: newAmount,
      price,
      discount,
      debt,
      changedUserId: req.body.changedUserId,
      totalPrice: expectedTotal,
      given,
    };

    await Sell.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json("Продажа успешно изменена!");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
