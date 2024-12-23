"use client"
import React, {useEffect, useState} from "react";
import {useCartStore} from "@/state/cart_store";
import {Page} from "@/components";
import ProductCard from "@/components/Card/ProductCard";
import ProductModal from "@/components/ProductModal/ProductModal";


export default function CatalogPage() {
    const [selectedProduct, setSelectedProduct] = useState(null)

    const products = useCartStore(state => state.products)
    console.log(products)
    return (
        <Page back={false}>
            <div className="mx-1 mb-16 overflo">
                <div className="flex justify-center mt-3 flex-wrap">
                    {products?.length > 0 && products.map((product) => (
                        <ProductCard product={product} key={product.id} setSelectedProduct={setSelectedProduct}/>
                    ))}

                    {!products?.length && <h1>По вашим фильтрам ничего не найдено</h1>}
                </div>
            </div>

            <ProductModal selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct}/>
        </Page>
    )
}