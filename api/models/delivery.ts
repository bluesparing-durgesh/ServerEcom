import mongoose, { Schema, Document, Model } from "mongoose";
import { DeliveryStatus } from "./order";

export interface IStep {
  label: string;
  description: string;
  samay: string;
}

export interface IDelivery extends Document {
  orderId: string;
  currentStatus: DeliveryStatus;
  deliveredDate?: string;
  orderSteps: IStep[];
}

const StepSchema: Schema = new Schema({
  label: { type: String, required: true },
  description: { type: String, required: true },
  samay: { type: String, required: true },
});

const DeliverySchema: Schema = new Schema({
  orderId: { type: String, required: true },
  deliveredDate: { type: String },
  currentStatus: {
    type: String,
    enum: Object.values(DeliveryStatus),
    required: true,
  },
  orderSteps: { type: [StepSchema], required: true },
},{timestamps:true});

const Delivery: Model<IDelivery> = mongoose.model<IDelivery>(
  "Delivery",
  DeliverySchema
);

export default Delivery;
