import mongoose from "mongoose";

const WithdrawSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    toWhom: {
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

const WithDraw = new mongoose.model("WithDraw", WithdrawSchema);

export default WithDraw;
