import express from "express";
import Order from "../models/order.js";
import CartItem from "../models/cartitem.js";

const router = express.Router();

/**
 * GET /orders/:userId
 * Get all orders for a user
 */
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /orders
 * Create a new order from cart items
 */
router.post("/", async (req, res) => {
  try {
    const { userId, deliveryDate, shippingFeeCents, taxCents, totalCents } =
      req.body;

    // Fetch user's cart items
    const cartItems = await CartItem.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Map cart items into order
    const orderItems = cartItems.map((item) => ({
      product: item.product,
      quantity: item.quantity
    }));

    const order = new Order({
      userId,
      items: orderItems,
      deliveryDate,
      shippingFeeCents,
      taxCents,
      totalCents,
      status: "Pending"
    });

    await order.save();

    // Clear cart after order placed
    await CartItem.deleteMany({ userId });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
