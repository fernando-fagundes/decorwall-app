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
  const [catalogName, setCatalogName] = useState("Novo Catálogo");
  const [saving, setSaving] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [activeCatalogId, setActiveCatalogId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    supabase.from("products").select("*").order("display_order").then(({ data }) => {
      if (data) { setProducts(data); if (data.length > 0) setSelectedProduct(data[0].id); }
    });
    supabase.from("categories").select("*").order("display_order").then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from("catalogs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => { if (data) setCatalogs(data); });
  }, [user]);

  const filteredCategories = selectedProduct ? categories.filter((c) => c.product_id === selectedProduct || c.product_id === null) : categories;
  const toggleCategory = (id: string) => { setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]); };
  const handleCreateCatalog = async () => { if (!user) { router.push("/login"); return; } if (selectedCategories.length === 0) { alert("Selecione ao menos uma categoria."); return; } setShowNameInput(true); };

  const handleSaveCatalog = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { data: catalog, error } = await supabase.from("catalogs").insert({ user_id: user.id, name: catalogName }).select().single();
      if (error) throw error;
      const items = selectedCategories.map((category_id) => ({ catalog_id: catalog.id, category_id }));
      await supabase.from("catalog_items").insert(items);
      setCatalogs((prev) => [catalog, ...prev]);
      setSelectedCategories([]); setShowNameInput(false); setCatalogName("Novo Catálogo"); setActiveCatalogId(catalog.id);
    } catch (err) { console.error(err); alert("Erro ao salvar catálogo."); } finally { setSaving(false); }
  };

  const handleDeleteCatalog = async (id: string) => {
    if (!confirm("Tem certeza?")) return;
    await supabase.from("catalogs").delete().eq("id", id);
    setCatalogs((prev) => prev.filter((c) => c.id !== id));
    if (activeCatalogId === id) setActiveCatalogId(null);
  };

  return (
    <div className="flex gap-6 max-w-7xl mx-auto px-4 py-8">
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Catálogo Online Decorwall</h1>
          <div className="border border-gray-200 rounded-xl p-4 mb-6">
            <h2 className="font-semibold text-gray-800 text-center mb-4">Produtos Decorwall</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {products.map((product) => (
                <button key={product.id} onClick={() => setSelectedProduct(product.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${selectedProduct === product.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                  <div className="w-full h-24 rounded-lg bg-cover bg-center bg-gray-100" style={product.image_url ? { backgroundImage: `url('${product.image_url}')` } : {}} />
                  <span className="text-sm font-medium text-gray-800 text-center leading-tight">{product.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="border border-gray-200 rounded-xl p-4">
            <h2 className="font-semibold text-gray-800 text-center mb-4">Categorias disponíveis</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredCategories.map((cat) => (
                <button key={cat.id} onClick={() => toggleCategory(cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left ${selectedCategories.includes(cat.id) ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}>
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-cover bg-center bg-gray-200" style={cat.image_url ? { backgroundImage: `url('${cat.image_url}')` } : {}} />
                  <span className="text-xs font-medium truncate">{cat.name}</span>
                </button>
              ))}
            </div>
            {selectedCategories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-600">{selectedCategories.length} categoria(s) selecionada(s)</span>
                <button onClick={handleCreateCatalog} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">Criar catálogo</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-64 flex-shrink-0 space-y-4">
        <button onClick={handleCreateCatalog} className="w-full bg-gray-900 text-white rounded-xl py-3 px-4 font-medium hover:bg-gray-700 transition-colors text-sm">Criar um catálogo personalizado</button>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Meus catálogos</h3>
          {!user ? (<p className="text-sm text-gray-500"><a href="/login" className="underline">Faça login</a> para ver seus catálogos.</p>)
          : catalogs.length === 0 ? (<p className="text-sm text-gray-500">Nenhum catálogo criado ainda.</p>)
          : (<ul className="space-y-2">{catalogs.map((catalog) => (<li key={catalog.id} className={`flex items-center justify-between rounded-lg px-3 py-2 cursor-pointer transition-colors ${activeCatalogId === catalog.id ? "bg-gray-200" : "hover:bg-gray-100"}`} onClick={() => setActiveCatalogId(catalog.id)}>
            <span className="text-sm text-gray-800 truncate">{catalog.name}</span>
            <button onClick={(e) => { e.stopPropagation(); handleDeleteCatalog(catalog.id); }} className="text-gray-400 hover:text-red-500 ml-2 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </li>))}</ul>)}
        </div>
      </div>
      {showNameInput && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Nome do catálogo</h2>
            <input type="text" value={catalogName} onChange={(e) => setCatalogName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400" placeholder="Ex: Catálogo Verão 2025" />
            <div className="flex gap-3">
              <button onClick={() => setShowNameInput(false)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSaveCatalog} disabled={saving || !catalogName.trim()} className="flex-1 bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors">{saving ? "Salvando..." : "Salvar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
    }
