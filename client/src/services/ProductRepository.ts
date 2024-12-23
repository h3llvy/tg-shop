import Product from "@/entities/Product";
import db from "@/services/db";

export default {
    all: async (searchQuery = "") => {
        await db.connect()

        return await Product.find({
            subtitle: {$regex: searchQuery, $options: "i"},
        }, {
            id: 1,
            image: 1,
            subtitle: 1,
            price: 1,
            _id: 0
        }).lean();
    }
}