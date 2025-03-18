import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
  {
    product: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    supplier: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
    },
    carNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    shortage: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    debt: {
      type: Number,
      required: true,
    },
    given: {
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
