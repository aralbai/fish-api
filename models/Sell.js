import mongoose from "mongoose";

const sellSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
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
    custumer: {
      id: {
        type: mongoose.Schema.Types.ObjectId || null,
      },
      fullname: {
        type: String,
        required: true,
      },
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    debt: {
      type: Number,
      required: true,
      min: 0,
    },
    given: {
      type: Number,
      required: true,
      min: 0,
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

const Sell = new mongoose.model("Sell", sellSchema);

export default Sell;
