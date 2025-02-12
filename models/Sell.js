import mongoose from "mongoose";

const sellSchema = new mongoose.Schema(
  {
    pruductId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
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

const Sell = new mongoose.model("Sell", sellSchema);

export default Sell;
