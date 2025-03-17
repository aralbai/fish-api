import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
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

const Product = new mongoose.model("Product", productSchema);

export default Product;
