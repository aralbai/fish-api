import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    pruductId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    carNumber: {
      type: String,
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

const Purchase = new mongoose.model("Purchase", purchaseSchema);

export default Purchase;
