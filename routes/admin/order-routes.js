import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from '../../controllers/admin/order-controller.js'
import express from 'express'
const router = express.Router()

router.get('/get', getAllOrdersForAdmin);
router.get('/details/:id', getOrderDetailsForAdmin);
router.put('/update/:id', updateOrderStatus);

export default router;
