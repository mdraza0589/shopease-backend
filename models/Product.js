import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: false,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: false,
            trim: true,
        },
        brand: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        salePrice: {
            type: Number,
            min: 0,
        },
        totalStock: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
