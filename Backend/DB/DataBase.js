import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const base = (process.env.MONGO_URI || '').replace(/\/+$/, '');
        await mongoose.connect(`${base}/Authentication-service`);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

export default connectDB;