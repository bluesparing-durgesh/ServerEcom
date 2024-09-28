import mongoose, { Document, Model, Schema } from "mongoose";

// Define an interface representing a document in MongoDB.
interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId; 
  quantity: number;
  image:string
  shipping?: boolean;
  rating: number;
}


const productSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true, 
      unique:true
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index: true, 
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "category",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    image: {
      type:String
    },
    shipping: {
      type: Boolean,
      default:false
    },
    rating: {
      type: Number,
      required: true,
      index: true, 
    },
  },
  { timestamps: true } 
);


const Product: Model<IProduct> = mongoose.model<IProduct>("Product", productSchema);

export default Product;
