import mongoose, { Schema, Document, Model } from "mongoose";
import { IProduct } from "./product";
import { IUser } from "./user";

// Define Cart Interface
export interface ICart extends Document {
  user: IUser["_id"];
  product: IProduct["_id"];
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema: Schema<ICart> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },

  { timestamps: true }
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
