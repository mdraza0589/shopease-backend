import Product from "../../models/Product.js"; // ✅ Always include .js when using ES modules

// 🔍 Controller: Search Products
const searchProducts = async (req, res) => {
    try {
        const { keyword } = req.params;

        // 🧠 Validate input
        if (!keyword || typeof keyword !== "string") {
            return res.status(400).json({
                success: false,
                message: "Keyword is required and must be a string",
            });
        }

        // 🔍 Create regex for case-insensitive partial match
        const regEx = new RegExp(keyword, "i");

        // 🧾 Search query (title, description, category, brand)
        const createSearchQuery = {
            $or: [
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },
            ],
        };

        const searchResult = await Product.find(createSearchQuery);

        res.status(200).json({
            success: true,
            data: searchResult,
        });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({
            success: false,
            message: "Error searching products",
        });
    }
};

export default searchProducts;
