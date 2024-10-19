import mongoose, { Schema, Document } from "mongoose";

export enum PaymentMethod {
  ONLINE = "Online",
  CASH_ON_DELIVERY = "Cash on Delivery",
}

export enum DeliveryStatus {
  ORDERED = "order complete",
  SHIPPED = "shipped",
  OUT_OF_DELIVERY = "out of delivery",
  DELIVERED = "delivered",
  Canceled = "canceled",
  Refunding = "refunding",
  Refunded = "redund complete",
}
export interface IOrderItem {
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: mongoose.Schema.Types.ObjectId;
}

export interface IOrder extends Document {
  user: mongoose.Schema.Types.ObjectId;
  quantity: number;
  image: string;
  name: string;
  product: mongoose.Schema.Types.ObjectId;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
  totalPrice: number;
  payment: mongoose.Schema.Types.ObjectId | null;
  refund: mongoose.Schema.Types.ObjectId | null;
  isPaid: boolean;
  isDelivered: DeliveryStatus;
  deliveredAt?: Date;
 feedback?:string;
}

const orderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paymemt",
    },
    refund: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paymemt",
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    isDelivered: {
      type: String,
      enum: Object.values(DeliveryStatus),
      required: true,
      default: DeliveryStatus.ORDERED,
    },
    deliveredAt: { type: Date },
    feedback:{type:String}
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function (next) {
  if (this.paymentMethod === PaymentMethod.ONLINE && !this.payment) {
    return next(new Error("Payment is required for online payment method."));
  }
  next();
});
const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
