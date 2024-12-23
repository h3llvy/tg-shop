import Product from "@/entities/Product";
import mongoose from "mongoose";
import db from "@/services/db";

export async function GET(req) {
    const searchQuery  = req.nextUrl.searchParams.get('searchQuery');
    console.log(searchQuery)
    try {
        if (mongoose.connection.readyState !== 1) {
            await db.connect()
        }

        const filter = searchQuery
            ? { subtitle: { $regex: searchQuery, $options: "i" } }
            : {};

        console.log(filter)
        const products = await Product.find(filter, { id: 1, image: 1, subtitle: 1, price: 1, _id: 0 }).lean();

        return new Response(JSON.stringify(products), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}