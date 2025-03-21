import Deposit from "../models/Deposit.js";

// Get single deposit
export const getDeposit = async (req, res) => {
  console.log("adadsf");
  try {
    const deposit = await Deposit.findOne({ _id: req.params.id });

    res.status(200).json(deposit);
  } catch (err) {
    res.status(500).json(err);
  }
};

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

// Get all deposits
export const getDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find().sort({ createdAt: -1 });

    res.status(200).json(deposits);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add new deposit
export const addDeposit = async (req, res) => {
  try {
    const newDeposit = new Deposit({
      amount: req.body.amount,
      fromWhom: req.body.fromWhom,
      addedDate: new Date(req.body.addedDate),
      addedUserId: req.body.addedUserId,
    });

    await newDeposit.save();

    res.status(201).json("Депозит добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Edit deposit
export const editDeposit = async (req, res) => {
  try {
    const data = {
      amount: req.body.amount,
      fromWhom: req.body.fromWhom,
      addedDate: new Date(req.body.addedDate),
      changedUserId: req.body.changedUserId,
    };

    console.log(data);

    const updatedDeposit = await Deposit.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );

    if (!updatedDeposit) {
      return res.status(400).json("Deposit not found!");
    }

    res.status(200).json("Депозит изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete deposit
export const deleteDeposit = async (req, res) => {
  try {
    await Deposit.findByIdAndDelete(req.params.id);

    res.status(200).json("Депозит удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
