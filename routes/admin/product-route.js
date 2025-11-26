import express from 'express'
import { upload } from '../../helpers/cloudinary.js';
import { handleImageUpload, addProduct, fetchProduct, aditProduct, DeleteProduct } from '../../controllers/admin/product-controller.js';

const router = express.Router();

router.post('/upload-image', upload.single("my_file"), handleImageUpload)
router.post('/add', addProduct)
router.get('/get', fetchProduct)
router.put('/edit/:id', aditProduct)
router.delete('/delete/:id', DeleteProduct)

export default router;

