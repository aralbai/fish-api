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
    },
    changedUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Sell = new mongoose.model("Sell", sellSchema);

export default Sell;
