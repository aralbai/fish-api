import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
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

const Supplier = new mongoose.model("Supplier", supplierSchema);

export default Supplier;
