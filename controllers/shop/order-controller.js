import razorpayInstance from "../../helpers/razorpay.js";
import crypto from "crypto";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import dotenv from 'dotenv';
dotenv.config();

/* -------------------- 🧾 CREATE RAZORPAY ORDER -------------------- */
export const createOrder = async (req, res) => {
    console.log("🧪 Razorpay Keys:", process.env.RAZORPAY_ID_KEY, process.env.RAZORPAY_SECRET_KEY);

    try {
        const { userId, cartItems, addressInfo, totalAmount, cartId } = req.body;

        console.log("📩 Incoming Order Body:", req.body);

        if (!userId || !cartItems?.length || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data",
            });
        }

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        // 🔍 Create Razorpay Order
        let razorpayOrder;
        try {
            razorpayOrder = await razorpayInstance.orders.create(options);
            console.log("🧾 Razorpay Order Created:", razorpayOrder);
        } catch (error) {
            console.log("❌ Razorpay Error:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Server error while creating Razorpay order",
            });
        }

        if (!razorpayOrder) {
            return res.status(500).json({
                success: false,
                message: "Failed to create Razorpay order",
            });
        }

        // 📦 Create DB Order
        const newOrder = await Order.create({
            userId,
            cartItems,
            addressInfo,
            orderStatus: "Pending",
            paymentMethod: "Razorpay",
            paymentStatus: "Pending",
            totalAmount,
            orderDate: new Date(),
            orderUpdateDate: new Date(),
            paymentId: razorpayOrder.id,
            razorpayOrderId: razorpayOrder.id,
            cartId,
        });

        return res.status(201).json({
            success: true,
            message: "Razorpay order created successfully",
            razorpayOrder,
            dbOrderId: newOrder._id,
            key: process.env.RAZORPAY_ID_KEY,
        });

    } catch (error) {
        console.error("🔥 Error creating Razorpay order:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Server error while creating Razorpay order",
        });
    }
};


/* -------------------- ✅ VERIFY PAYMENT -------------------- */
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details",
            });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
            .update(sign.toString())
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { paymentId: razorpay_order_id },
            {
                paymentStatus: "Paid",
                orderStatus: "Confirmed",
                payerId: razorpay_payment_id,
                orderUpdateDate: new Date(),
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // 🏷 Reduce Product Stock
        for (let item of updatedOrder.cartItems) {
            let product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }

            if (product.totalStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.title}`,
                });
            }

            product.totalStock -= item.quantity;
            await product.save();
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order: updatedOrder,
        });

    } catch (error) {
        console.error("🔥 Error verifying Razorpay payment:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while verifying payment",
        });
    }
};


/* -------------------- 🧾 GET ALL ORDERS BY USER -------------------- */
export const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const orders = await Order.find({ userId }).sort({ orderDate: -1 });

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error("🔥 Error fetching user orders:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching user orders",
        });
    }
};


/* -------------------- 📦 GET ORDER DETAILS -------------------- */
export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        console.error("🔥 Error fetching order details:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching order details",
        });
    }
};
