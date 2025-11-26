import Product from "../../models/Product.js";
import Review from "../../models/Review.js";

const getFilterProduct = async (req, res) => {
    try {
        const { category = [], brand = [], sortBy = "price-lowToHigh" } = req.query;

        let filters = {};

        if (category.length) {
            filters.category = { $in: category.split(",") };
        }

        if (brand.length) {
            filters.brand = { $in: brand.split(",") };
        }

        let sort = {};

        switch (sortBy) {
            case "price-lowToHigh":
                sort.price = 1;
                break;
            case "price-highToLow":
                sort.price = -1;
                break;
            case "name-atoz":
                sort.title = 1;
                break;
            case "name-ztoa":
                sort.title = -1;
                break;
            default:
                sort.price = 1;
                break;
        }

        const product = await Product.find(filters).sort(sort);

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Some error occurred",
        });
    }
};


const getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({
            success: false,
            message: 'Product not found!'
        })

        res.status(200).json({
            success: true,
            data: product
        })
    } catch (error) {
        console.log(error);
        res.status(404).json({
            success: false,
            message: "Some error occurred",
        });
    }
}

export { getFilterProduct, getProductDetails };

