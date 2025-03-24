import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import mongoose, { disconnect } from "mongoose";

// Get one purchase with _id
export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id });

    res.status(200).json(purchase);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get total price of purchases
export const getTotalPrice = async (req, res) => {
  try {
    const totalPurchases = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json({ totalPurchases: totalPurchases[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get only single supplier purchases
export const getSingleSupplierPurchases = async (req, res) => {
  try {
    const debtPurchases = await Purchase.find({
      "supplier.id": req.params.supplierId,
    }).sort({ createdAt: -1 });

    res.json(debtPurchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get only single supplier debt purchases
export const getSingleSupplierDebtPurchases = async (req, res) => {
  try {
    const debtPurchases = await Purchase.find({
      debt: { $gt: 0 },
      "supplier.id": req.params.supplierId,
    }).sort({ createdAt: -1 });

    res.json(debtPurchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get total amount of purchases
export const getTotalAmount = async (req, res) => {
  try {
    const totalPurchases = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$remainingAmount" },
        },
      },
    ]);

    res.json({ totalAmount: totalPurchases[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get active purchases (remainingAmount > 0)
export const getActivePurchases = async (req, res) => {
  try {
    const activePurchases = await Purchase.find({
      remainingAmount: { $gt: 0 },
    });

    res.status(200).json(activePurchases);
  } catch (err) {
    res.status(400).json(err);
  }
};

// Get all purchases
export const getPurchases = async (req, res) => {
  try {
    const { productId, supplierId, status, startDate, endDate } = req.query;

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

    if (supplierId) {
      filter["supplier.id"] = supplierId;
    }

    if (status) {
      if (status === "active") {
        filter.remainingAmount = { $gt: 0 };
      }

      if (status === "deactive") {
        filter.remainingAmount = 0;
      }
      if (status === "shortage") {
        filter.shortage = { $gt: 0 };
      }
    }

    const purchases = await Purchase.find(filter).sort({ addedDate: -1 });

    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all purchases with query
export const getPurchasesQuery = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "startDate and endDate are required" });
    }

    const purchases = await Purchase.find({
      addedDate: {
        $gte: new Date(startDate), // Greater than or equal to startDate
        $lte: new Date(endDate), // Less than or equal to endDate
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(purchases);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add new  purchase
export const addPurchase = async (req, res) => {
  try {
    const newPurchase = new Purchase({
      product: req.body.product,
      supplier: req.body.supplier,
      carNumber: req.body.carNumber,
      amount: parseFloat(req.body.amount),
      price: parseFloat(req.body.price),
      discount: parseFloat(req.body.discount),
      totalPrice:
        parseFloat(req.body.amount) * parseFloat(req.body.price) -
        parseFloat(req.body.discount),
      remainingAmount: parseFloat(req.body.amount),
      addedDate: new Date(req.body.addedDate),
      addedUserId: req.body.addedUserId,
    });

    await newPurchase.save();

    res.status(201).json("Покупка добавлена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit purchase
export const editPurchase = async (req, res) => {
  const data = {
    product: req.body.product,
    supplier: req.body.supplier,
    carNumber: req.body.carNumber,
    amount: parseFloat(req.body.amount),
    price: parseFloat(req.body.price),
    discount: parseFloat(req.body.discount),
    totalPrice:
      parseFloat(req.body.amount) * parseFloat(req.body.price) -
      parseFloat(req.body.discount),
    remainingAmount: parseFloat(req.body.amount),
    addedDate: new Date(req.body.addedDate),
    changedUserId: req.body.changedUserId,
  };

  try {
    await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json("Покупка изменена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit purchase with shortage
export const editPurchaseShortage = async (req, res) => {
  try {
    const id = req.params.id;
    const shortage = req.body.shortage;

    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      const purchase = await Purchase.findOne({ _id: req.params.id });

      await Purchase.findByIdAndUpdate(
        id,
        {
          shortage: shortage,
          remainingAmount:
            purchase?.shortage + purchase?.remainingAmount - shortage,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    } else {
      return res.status(400).json("Product not found!");
    }

    res.status(200).json("Покупка изменена!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete purchase
export const deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);

    res.status(200).json("Покупка удалена!");
  } catch (err) {
    res.status(500).json(err);
  }
};
