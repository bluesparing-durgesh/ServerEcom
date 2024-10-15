import mongoose, { Schema, Document, Model } from "mongoose";

enum PaymentTypes {
  BUY = "buy",
  REFUND = "refund",
}
enum IndianBanks {
  SBI = "State Bank of India",
  HDFC = "HDFC Bank",
  ICICI = "ICICI Bank",
  AXIS = "Axis Bank",
  PNB = "Punjab National Bank",
  BOI = "Bank of India",
  CANARA = "Canara Bank",
  IDBI = "IDBI Bank",
  KOTAK = "Kotak Mahindra Bank",
  YES = "YES Bank",
  UNION = "Union Bank of India",
  BOB = "Bank of Baroda",
  INDUSIND = "IndusInd Bank",
  FEDERAL = "Federal Bank",
  UCO = "UCO Bank",
}

interface IPayment extends Document {
  amount: number;
  paymentType: PaymentTypes;
  bank: IndianBanks;
  from: string;
  to: string;
  cardNumber: number;
  createdAt: Date;
  updatedAt: Date;
}
const paymentSchema: Schema<IPayment> = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    bank: {
      type: String,
      enum: Object.values(IndianBanks),
      required: true,
    },
    cardNumber: {
      type: Number,
      required: true,
    },
    paymentType: {
      type: String,
      enum: Object.values(PaymentTypes),
      required: true,
      default: PaymentTypes.BUY,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Payment: Model<IPayment> = mongoose.model<IPayment>(
  "Payment",
  paymentSchema
);

export default Payment;
