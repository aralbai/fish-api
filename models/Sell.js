import mongoose from "mongoose";

const sellSchema = new mongoose.Schema(
  {
    purchase: {
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
        type: mongoose.Schema.Types.ObjectId,
        required: true,
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
    repays: {
      type: [
        {
          amount: { type: Number, required: true },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
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
      required: true,
    },
  },
  { timestamps: true }
);

const Sell = new mongoose.model("Sell", sellSchema);

export default Sell;
