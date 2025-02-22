import mongoose from "mongoose";

const imcomeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    addedDate: {
      type: Date,
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

const Income = new mongoose.model("Income", imcomeSchema);

export default Income;
