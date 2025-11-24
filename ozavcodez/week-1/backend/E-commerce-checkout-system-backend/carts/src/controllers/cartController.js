const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, productName, price, quantity = 1, imageUrl } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        productName,
        price,
        quantity,
        imageUrl,
      });
    }

    cart.calculateTotal();
    await cart.save();

    res.json({
      message: 'Item added to cart successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    const cart = await Cart.findOne({ userId }).populate('userId', 'name email');

    if (!cart) {
      return res.json({
        items: [],
        totalAmount: 0,
        message: 'Cart is empty',
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.calculateTotal();
    await cart.save();

    res.json({
      message: 'Item removed from cart successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};