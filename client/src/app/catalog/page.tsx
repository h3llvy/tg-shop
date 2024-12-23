"use client"
import React, {useEffect, useState} from "react";
import {useCartStore} from "@/state/cart_store";
import {Page} from "@/components";
import ProductCard from "@/components/Card/ProductCard";
import ProductModal from "@/components/ProductModal/ProductModal";


export default function CatalogPage() {
    const [selectedProduct, setSelectedProduct] = useState(null)

    const products = useCartStore(state => state.products)

    return (
        <Page back={false}>
            <div className="mx-1 mb-16 overflo">
                <div className="flex justify-center mt-3 flex-wrap">
                    {products.map((product) => (
                        <ProductCard product={product} key={product.id} setSelectedProduct={setSelectedProduct}/>
                    ))}
                </div>
            </div>

            <ProductModal selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
        </Page>
    )
}