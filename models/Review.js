import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
    },
    { timestamps: true } // ✅ automatically adds createdAt and updatedAt
);

export default mongoose.model("Review", reviewSchema);
                            