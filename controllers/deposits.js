import Deposit from "../models/Deposit.js";

// Get total deposits
export const getTotalDeposits = async (req, res) => {
  try {
    const totalDeposits = await Deposit.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ totalDeposits: totalDeposits[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().sort({ createdAt: -1 });

    res.status(200).json(deposits);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addDeposit = async (req, res) => {
  try {
    const newDeposit = new Deposit({
      amount: req.body.amount,
      fromWhom: req.body.fromWhom,
      addedDate: req.body.addedDate,
    });

    await newDeposit.save();

    res.status(201).json("Депозит добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editDeposit = async (req, res) => {
  try {
    await Deposit.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json("Депозит изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteDeposit = async (req, res) => {
  try {
    await Deposit.findByIdAndDelete(req.params.id);

    res.status(200).json("Депозит удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
