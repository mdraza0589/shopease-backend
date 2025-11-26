import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth/auth-routes.js';
import shopProductFilterRouter from './routes/shop/products-routes.js'
import adminProductRoute from './routes/admin/product-route.js'
import adminOrderRoute from './routes/admin/order-routes.js'
import shopCartRouter from './routes/shop/cart-routes.js'
import shopAddressRouter from './routes/shop/address-routes.js'
import shopOrderRouter from './routes/shop/order-routes.js'
import shopSearchRouter from './routes/shop/search-routes.js'
import shopReviewRouter from './routes/shop/review-routes.js'

dotenv.config();

const app = express();
app.use(express.json())
app.use(cookieParser());

app.use(cors({
    origin: 'https://shopease-mern.vercel.app/',
    credentials: true,
}));

connectDB();

app.use('/api/auth', authRouter);
app.use('/api/admin/products', adminProductRoute);
app.use('/api/admin/orders', adminOrderRoute);
app.use('/api/shop/products', shopProductFilterRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', shopReviewRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server connected on port ${PORT}`);
});


