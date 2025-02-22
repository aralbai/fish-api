import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Balance = new mongoose.model("Balance", balanceSchema);

export default Balance;
