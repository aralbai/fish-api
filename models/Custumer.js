import mongoose from "mongoose";

const custumerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    limit: {
      type: Number,
      default: -1,
    },
    debt: {
      type: Number,
      default: 0,
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

const Custumer = new mongoose.model("Custumer", custumerSchema);

export default Custumer;
