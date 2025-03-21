import mongoose from "mongoose";

const DepositSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    fromWhom: {
      type: String,
      required: true,
    },
    addedDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    addedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    changedUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Deposit = new mongoose.model("Deposit", DepositSchema);

export default Deposit;
