import mongoose from "mongoose";

export default {
    connect: async () => {
        await mongoose.connect(process.env.MONGO_URI);
    }
}