import mongoose, { Schema } from "mongoose";
import validator from "validator";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    image: {
      type: String,
      required: [true, "Image is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
