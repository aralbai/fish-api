import Withdraw from "../models/Withdraw.js";

// Get total withdraws
export const getTotalWithdraws = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (startDate && endDate) {
      const totalWithdraws = await Withdraw.aggregate([
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
            total: { $sum: "$amount" },
          },
        },
      ]);

      return res
        .status(200)
        .json({ totalWithdraws: totalWithdraws[0]?.total || 0 });
    }

    const totalWithdraws = await Withdraw.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ totalWithdraws: totalWithdraws[0]?.total || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single withdraw
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

// Adde new withdraw
export const addWithdraw = async (req, res) => {
  try {
    const newWithdraw = new Withdraw({
      amount: parseFloat(req.body.amount),
      toWhom: req.body.toWhom,
      addedDate: new Date(req.body.addedDate),
      addedUserId: req.body.addedUserId,
    });

    await newWithdraw.save();

    res.status(201).json("Снят добавлен!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editWithdraw = async (req, res) => {
  try {
    const data = {
      amount: parseFloat(req.body.amount),
      toWhom: req.body.toWhom,
      addedDate: new Date(req.body.addedDate),
      changedUserId: req.body.changedUserId,
    };

    const updatedWithdraw = await Withdraw.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );

    if (!updatedWithdraw) {
      return res.status(400).json("Withdraw not found!");
    }

    res.status(200).json("Снят изменён!");
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete withdraw
export const deleteWithdraw = async (req, res) => {
  try {
    await Withdraw.findByIdAndDelete(req.params.id);

    res.status(200).json("Снят удалён!");
  } catch (err) {
    res.status(500).json(err);
  }
};
