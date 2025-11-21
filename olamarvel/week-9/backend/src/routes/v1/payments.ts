import express from 'express';
import { getPaymentsCached } from '../../controllers/v1/payments';
import asyncHandler from '../../Middlewares/aysncHandler';

const router = express.Router();

router.get('/', asyncHandler(async (req, res, next) => {
    const payments = await getPaymentsCached();
    res.json({ data: payments });
}));

export default router;
