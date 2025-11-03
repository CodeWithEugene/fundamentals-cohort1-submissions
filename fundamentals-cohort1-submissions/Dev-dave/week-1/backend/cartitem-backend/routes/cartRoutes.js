import express from "express";
import CartItem from "../models/cartitem.js";

const router = express.Router();

/**
 * GET /cart/:userId
 * Get all cart items for a user
 */
router.get("/:userId", async (req, res) => {
   console.log("Fetching cart for userId:", req.params.userId);
   
  try {
    const items = await CartItem.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /cart
 * Add item to cart
 */
router.post("/", async (req, res) => {

  try {
    const { userId, product, quantity } = req.body;

    // Check if product already exists in cart for user
    const existingItem = await CartItem.findOne({
      userId,
      "product.id": product.id
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.json(existingItem);
    }

    const newItem = new CartItem({ userId, product, quantity });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /cart/:id
 * Update quantity of a cart item
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// delete item from cart
router.delete("/:id", async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
