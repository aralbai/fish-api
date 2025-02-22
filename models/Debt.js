import mongoose from "mongoose";

const debtSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    toWhom: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
    },
    addedDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    addedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: "679a0e92d45ceffc2233ed55",
    },
    changedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: "679a0e92d45ceffc2233ed55",
    },
  },
  { timestamps: true }
);

const Debt = new mongoose.model("Debt", debtSchema);

export default Debt;
