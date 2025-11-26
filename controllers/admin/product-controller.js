import { imageUpload } from "../../helpers/cloudinary.js";
import Product from "../../models/Product.js";

const handleImageUpload = async (req, res) => {
    try {
        // ensure req.file exists
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        // data URL must include a comma after 'base64,'
        const url = `data:${req.file.mimetype};base64,${b64}`;

        // imageUpload helper accepts either a data-URL string or an object with a buffer
        const result = await imageUpload(url);

        res.status(200).json({
            success: true,
            result,
            url: result?.secure_url || result?.url || null,
        });
    } catch (error) {
        console.error('handleImageUpload error:', error);
        res.status(500).json({
            success: false,
            message: 'error occured in image upload',
            error: error?.message || error,
        });
    }
}

// add a new product 
// fetch a all poroduct 
// edit a product
// delete a product

const addProduct = async (req, res) => {
    try {
        // log incoming body for debugging
        console.log('addProduct req.body:', req.body);

        let {
            image,
            title,
            description,
            brand,
            price,
            salePrice,
            totalStock,
            category,
        } = req.body;

        // Coerce numeric fields if they are strings
        price = price === undefined || price === null ? price : Number(price);
        salePrice = salePrice === undefined || salePrice === null ? salePrice : Number(salePrice);
        totalStock = totalStock === undefined || totalStock === null ? totalStock : Number(totalStock);

        // Basic validation
        const missing = [];
        if (!title) missing.push('title');
        if (!description) missing.push('description');
        if (!brand) missing.push('brand');
        if (price === undefined || price === null || Number.isNaN(price)) missing.push('price');
        if (totalStock === undefined || totalStock === null || Number.isNaN(totalStock)) missing.push('totalStock');

        if (missing.length) {
            return res.status(400).json({
                success: false,
                message: 'Missing or invalid fields',
                missing,
            });
        }

        const newProduct = new Product({
            image,
            title,
            description,
            brand,
            price,
            salePrice,
            totalStock,
            category,
        });

        const savedProduct = await newProduct.save();
        return res.status(200).json({
            success: true,
            message: 'data added successfully.',
            data: savedProduct,
        });
    } catch (error) {
        console.error('addProduct error:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong in addProduct',
            error: error?.message || error,
        });
    }
};


const fetchProduct = async (req, res) => {
    try {
        const listOfData = await Product.find({});
        if (listOfData.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'could not find data.'
            });
        }
        res.status(200)
            .json({
                success: true,
                data: listOfData
            })
    } catch (error) {
        console.log(error);
        res.status(404)
            .json({
                success: false,
                message: "Something went wrong from addProduct"
            })
    }
}

const aditProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            description,
            brand,
            price,
            salePrice,
            totalStock,
        } = req.body;

        const findProduct = await Product.findById(id);
        if (!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price || findProduct.price;
        findProduct.salePrice = salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;

        const updatedProduct = await findProduct.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("Error editing product:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while editing the product",
        });
    }
};


const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            res.status(400).json({
                success: false,
                message: "product could not delete."
            })
        }
        res.status(200)
            .json({
                success: true,
                message: "user deleted successfully."
            })
    } catch (error) {
        console.log(error);
        res.status(404)
            .json({
                success: false,
                message: "Something went wrong from addProduct"
            })
    }
}

export { handleImageUpload, DeleteProduct, aditProduct, fetchProduct, addProduct }
