import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import productsRouter from "./routes/products.js";
import custumersRouter from "./routes/custumers.js";
import suppliersRouter from "./routes/suppliers.js";
import purchasesRouter from "./routes/purchases.js";
import sellsRouter from "./routes/sells.js";

const app = express();

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

app.listen(process.env.PORT, () => {
  console.log("Server is running...");
});
