import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // will come from frontend (guestId in localStorage)

    product: {
      id: { type: Number, required: true },   // product ID from frontend array
      name: { type: String, required: true }, // product name
      image: { type: String, required: true }, // product image path
      priceCents: { type: Number, required: true } // price in cents
    },

    quantity: { type: Number, required: true, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("CartItem", cartItemSchema);
