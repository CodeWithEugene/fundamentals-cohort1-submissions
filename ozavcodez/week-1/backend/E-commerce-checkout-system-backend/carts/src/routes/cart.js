const express = require('express');
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add-to-cart', auth, cartController.addToCart);
router.get('/get-cart/:userId', cartController.getCart);
router.delete('/remove/:productId', auth, cartController.removeFromCart);
router.delete('/clear', auth, cartController.clearCart);

module.exports = router;