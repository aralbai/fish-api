import Balance from "../models/Balance.js";

export const getBalance = async (req, res) => {
  try {
    const balance = await Balance.find();

    res.status(200).json(balance);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addBalance = async (req, res) => {
  try {
    const newBalance = new Balance(req.body);

    await newBalance.save();

    res.status(201).json("Balans added!");
  } catch (err) {
    res.status(500).json(err);
  }
};

export const editBalance = async (req, res) => {
  try {
    if (req.body.type) {
      if (req.body.type === "increase") {
        const balance = await Balance.find();

        if (balance[0]?.amount - req.body.amount < 0) {
          return res.status(200).json("Not enough money!");
        }

        await Balance.findOneAndUpdate({
          amount: balance[0].amount - req.body.amount,
        });
      }

      if (req.body.type === "decrease") {
        const balance = await Balance.find();

        await Balance.findOneAndUpdate({
          amount: balance[0].amount + req.body.amount,
        });
      }
    }

    res.status(201).json("Balans updated!");
  } catch (err) {
    res.status(500).json(err);
  }
};
