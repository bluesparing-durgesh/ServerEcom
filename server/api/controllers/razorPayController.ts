import { Request, Response } from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

const razorpay = new Razorpay({ 
  key_id: process.env.RAZORPAY_KEY_ID as string, 
  key_secret: process.env.RAZORPAY_KEY_SECRET as string 
});

export const initiatePaymentController = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    if (typeof amount !== "number") {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order_id: order.id });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error });
  }
};


export const verifyPaymentController = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature) {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);

    const digest = shasum.digest("hex");

    if (digest === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ error: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error });
  }
};

