import mongoose from "mongoose";

const repaySchema = new mongoose.Schema(
  {
    custumerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: Number,
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
  },
  { timestamps: true }
);

const Repay = new mongoose.model("Repay", repaySchema);

export default Repay;
