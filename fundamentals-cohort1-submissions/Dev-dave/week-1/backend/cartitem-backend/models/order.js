import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // same guestId from frontend

    items: [
      {
        product: {
          id: { type: Number, required: true },
          name: { type: String, required: true },
          image: { type: String, required: true },
          priceCents: { type: Number, required: true }
        },
        quantity: { type: Number, required: true, default: 1 }
      }
    ],

    deliveryDate: { type: Date, required: true }, // chosen by user
    shippingFeeCents: { type: Number, required: true },
    taxCents: { type: Number, required: true },
    totalCents: { type: Number, required: true },

    status: { type: String, default: "Pending" } // Pending, Shipped, Completed, Cancelled
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
