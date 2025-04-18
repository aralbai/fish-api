import mongoose from "mongoose";

const outcomeSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    purpose: {
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
    },
    changedUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Outcome = new mongoose.model("Outcome", outcomeSchema);

export default Outcome;
