import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import productsRouter from "./routes/products.js";
import custumersRouter from "./routes/custumers.js";
import suppliersRouter from "./routes/suppliers.js";
import purchasesRouter from "./routes/purchases.js";
import sellsRouter from "./routes/sells.js";
import outcomesRouter from "./routes/outcomes.js";
import depositsRouter from "./routes/deposits.js";
import withdrawsRouter from "./routes/withdraws.js";
import usersRouter from "./routes/users.js";
import repaysRouter from "./routes/repays.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_CONN)
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/products", productsRouter);
app.use("/api/custumers", custumersRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/purchases", purchasesRouter);
app.use("/api/sells", sellsRouter);
app.use("/api/outcomes", outcomesRouter);
app.use("/api/deposits", depositsRouter);
app.use("/api/withdraws", withdrawsRouter);
app.use("/api/users", usersRouter);
app.use("/api/repays", repaysRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
