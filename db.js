import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const connectDB = async (mongoUri = process.env.MONGO_URI) => {
    if (!mongoUri) {
        throw new Error('MONGO_URI environment variable is not set')
    }

    // If already connected, return the existing connection (helps with hot reloads)
    if (mongoose.connection.readyState === 1) {
        console.log('MongoDB: already connected')
        return mongoose.connection
    }

    try {
        // Mongoose 6+ no longer needs many options; keep defaults
        const conn = await mongoose.connect(mongoUri)
        console.log(`MongoDB connected: ${conn.connection.host}`)

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err)
        })

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected')
        })

        return conn
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err)
        throw err
    }
}

export default connectDB
export { mongoose }

