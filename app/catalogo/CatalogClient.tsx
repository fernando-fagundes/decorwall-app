"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Product = { id: string; name: string; slug: string; image_url: string | null };
type Category = { id: string; name: string; slug: string; image_url: string | null; product_id: string | null };
type Catalog = { id: string; name: string; created_at: string };

export default function CatalogClient() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [catalogName, setCatalogName] = useState("Novo Cat\u00e1logo");
  const [saving, setSaving] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [activeCatalogId, setActiveCatalogId] = useState<string | null>(null);

  // Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    supabase.from("products").select("*").order("display_order").then(({ data }) => { if (data) { setProducts(data); if (data.length > 0) setSelectedProduct(data[0].id); } });
    supabase.from("categories").select("*").order("display_order").then(({ data }) => { if (data) setCategories(data); });
  }, []);
  useEffect(() => { if (!user) return; supabase.from("catalogs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => { if (data) setCatalogs(data); }); }, [user]);
  const filteredCategories = selectedProduct ? categories.filter((c) => c.product_id === selectedProduct || c.product_id === null) : categories;
  const toggleCategory = (id: string) => { setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]); };
  return <div>{filteredCategories.length}</div>;
}
