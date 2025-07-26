import { model, models, Schema } from "mongoose";
import { productTypes } from "../types/index";

const ProductSchema = new Schema<productTypes>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    price: {
      mrp: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
    },
    images: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Products =
  models?.Products || model<productTypes>("Products", ProductSchema);

export default Products;
