import Order from "../../models/Order.js";

const getAllOrdersForAdmin = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ orderDate: -1 })
            .populate("userId", "name email");

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: "No orders found",
            });
        }

        return res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching all orders",
            error: error.message,
        });
    }
};


const getOrderDetailsForAdmin = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const order = await Order.findById(orderId).populate("userId", "name email");

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
        console.error("Error fetching order details:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching order details",
            error: error.message,
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder,
        });


    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: error.message,
        });
    }
};



export { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus };

