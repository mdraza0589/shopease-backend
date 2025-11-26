import express from "express";
import { addToCart, deleteCartItem, fetchCartItmes, updateCartItemQuantity } from "../../controllers/shop/cart-controller.js";


const router = express.Router();

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItmes);
router.put("/update-cart", updateCartItemQuantity);
router.delete("/:userId/:productId", deleteCartItem);

export default router;


