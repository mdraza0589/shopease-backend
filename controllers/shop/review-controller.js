import Review from "../../models/Review.js";

// 📝 Add a Product Review
const addProductReview = async (req, res) => {
    try {
        const { productId, userId, comment, rating } = req.body;

        if (!productId || !userId || !comment || !rating) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required" });
        }

        const newReview = new Review({
            productId,
            userId,
            comment,
            rating,
        });

        await newReview.save();

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview, // ✅ changed key from 'data' → 'review' (more descriptive)
        });
    } catch (error) {
        console.error("Add Review Error:", error);
        res.status(500).json({
            success: false,
            message: "Error adding review",
        });
    }
};

// 📦 Get All Reviews for a Product
const getProductReview = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res
                .status(400)
                .json({ success: false, message: "Product ID is required" });
        }

        const reviews = await Review.find({ productId }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            reviews, // ✅ changed key from 'data' → 'reviews' for clarity
        });
    } catch (error) {
        console.error("Get Review Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching reviews",
        });
    }
};

export { addProductReview, getProductReview };
