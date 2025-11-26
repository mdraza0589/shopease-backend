import { createOrder, getAllOrdersByUser, getOrderDetails, verifyPayment } from '../../controllers/shop/order-controller.js'
import express from 'express'
const router = express.Router()

router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.get('/list/:userId', getAllOrdersByUser);
router.get('/details/:id', getOrderDetails);

export default router;

