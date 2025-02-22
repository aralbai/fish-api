import Balance from "../models/Balance.js";

export const balance = async (req, res, next) => {
  console.log("fdfdfd");
  try {
    if (req.body.type) {
      if (req.body.type === "decrease") {
        const balance = await Balance.find();

        if (balance[0]?.amount - req.body.amount < 0) {
          return res.status(400).json("Not enough money!");
        }

        await Balance.findOneAndUpdate({
          amount: parseFloat(balance[0].amount) - parseFloat(req.body.amount),
        });
      }

      if (req.body.type === "increase") {
        const balance = await Balance.find();

        await Balance.findOneAndUpdate({
          amount: parseFloat(balance[0].amount) + parseFloat(req.body.amount),
        });
      }
    }

    next();
  } catch (err) {
    res.status(500).json(err);
  }
};
