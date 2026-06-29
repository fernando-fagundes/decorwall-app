"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Product = { id: string; name: string; slug: string; image_url: string | null };
type Category = { id: string; name: string; slug: string; image_url: string | null; product_id: string | null };

export default function CatalogClient() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  function getSupabase() {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.from("products").select("*").order("display_order").then(({ data }) => {
      if (data) {
        setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0].id);
      }
    });
    supabase.from("categories").select("*").order("display_order").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  const filteredCategories = selectedProduct
    ? categories.filter((c) => c.product_id === selectedProduct || c.product_id === null)
    : categories;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Catálogo Online Decorwall
        </h1>

        {/* Product type selector */}
        <div className="border border-gray-200 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-800 text-center mb-4">
            Produtos Decorwall
          </h2>
          <p className="text-sm text-gray-500 text-center mb-4">
            Clique no produto para visualizar as categorias.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  selectedProduct === product.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div
                  className="w-full h-24 rounded-lg bg-cover bg-center bg-gray-100"
                  style={product.image_url ? { backgroundImage: `url('${product.image_url}')` } : {}}
                />
                <span className="text-sm font-medium text-gray-800 text-center leading-tight">
                  {product.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Category grid */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-semibold text-gray-800 text-center mb-4">
            Categorias disponíveis
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-gray-400 transition-all"
              >
                <div
                  className="w-full h-24 rounded-lg bg-cover bg-center bg-gray-100"
                  style={cat.image_url ? { backgroundImage: `url('${cat.image_url}')` } : {}}
                />
                <span className="text-sm font-medium text-gray-700 text-center leading-tight">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
