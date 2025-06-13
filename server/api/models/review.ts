import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  review?: string;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
      index: true, 
    
    },
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
    },
  },
  { timestamps: true }
);
const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
