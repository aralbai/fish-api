import mongoose from "mongoose";

const sellSchema = new mongoose.Schema(
  {
    purchase: {
      type: {},
      required: true,
    },
    product: {
      type: {},
      required: true,
    },
    custumer: {
      type: {},
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: {
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
    repays: {
      type: [
        {
          amount: { type: Number, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
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

const Sell = new mongoose.model("Sell", sellSchema);

export default Sell;
