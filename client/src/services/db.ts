import mongoose from "mongoose";

export default {
    connect: async () => {
        await mongoose.connect('mongodb://root:example@mongodb:27017');
    }
}