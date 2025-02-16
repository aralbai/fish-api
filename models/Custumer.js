import mongoose from "mongoose";

const san = 5000;

const url = `http://localhost:${san}`;
const url2 = "http://localhost:" + san;

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

const Custumer = new mongoose.model("Custumer", custumerSchema);

export default Custumer;
