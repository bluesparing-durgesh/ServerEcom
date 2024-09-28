import { timeStamp } from "console";
import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
  },
  { timestamps: true } // Correctly set timestamps option
);

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "category",
  categorySchema
);

export default Category;
