import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Connect to MongoDB
        mongoose.connection.on('connected', () => console.log("Database connected"));
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;