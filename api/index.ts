import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRouter from "./routes/userRouter";
import categoryRouter from "./routes/categoryRouter";
import productRouter from "./routes/productRouter";
import cartRouter from "./routes/cartRouter";
import orderRouter from "./routes/orderRouter";
import deliveryRouter from "./routes/deliveryRouter";
import reviewRouter from './routes/reviewRouter'
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());
app.get("/", async (req: Request, res: Response) => {
  return res.send("hello");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/delivery", deliveryRouter);
app.use("/api/v1/review",reviewRouter);
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
