"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Collection = { id: string; name: string; slug: string; image_url: string | null };
type Category = { id: string; name: string; slug: string; image_url: string | null };
type Estampa = { id: string; nome: string; imagem_url: string | null };

export default function CatalogClient() {
  const supabase = createClient();

  // Data
  const [collections, setCollections] = useState<Collection[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [estampas, setEstampas] = useState<Estampa[]>([]);

  // Selection
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // UI
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingEstampas, setLoadingEstampas] = useState(false);
  const [lightbox, setLightbox] = useState<Estampa | null>(null);

  // ── Collections ───────────────────────────────────────────────────────────
  useEffect(() => {
    supabase
      .from("collections")
      .select("id, name, slug, image_url")
      .order("display_order")
      .then(({ data }) => { if (data) setCollections(data); });
  }, []);

  // ── Categories ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedCollection) {
      setCategories([]);
      setSelectedCategory(null);
      setEstampas([]);
      return;
    }
    setLoadingCategories(true);
    setSelectedCategory(null);
    setEstampas([]);
    supabase
      .from("categories")
      .select("id, name, slug, image_url")
      .eq("collection_id", selectedCollection)
      .order("display_order")
      .then(({ data }) => {
        if (data) setCategories(data);
        setLoadingCategories(false);
      });
  }, [selectedCollection]);

  // ── Estampas ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedCategory) {
      setEstampas([]);
      return;
    }
    setLoadingEstampas(true);
    supabase
      .from("estampas")
      .select("id, nome, imagem_url")
      .eq("category_id", selectedCategory)
      .eq("ativo", true)
      .order("display_order")
      .then(({ data }) => {
        if (data) setEstampas(data);
        setLoadingEstampas(false);
      });
  }, [selectedCategory]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const selectedCollectionName = collections.find((c) => c.id === selectedCollection)?.name;
  const selectedCategoryName = categories.find((c) => c.id === selectedCategory)?.name;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Catálogo Online Decorwall
      </h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        Navegue pelas linhas, categorias e estampas disponíveis
      </p>

      {/* ── 3 Grids ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_260px_1fr] gap-4 items-start">

        {/* Grid 1 — Collections */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Linha</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tipo de produto</p>
          </div>
          <div className="p-3 space-y-2">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => setSelectedCollection((prev) => prev === col.id ? null : col.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-2 transition-all text-left ${
                  selectedCollection === col.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-100 hover:border-gray-300 text-gray-800 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {col.image_url ? (
                  <div
                    className="w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${col.image_url}')` }}
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xl ${
                    selectedCollection === col.id ? "bg-white/20" : "bg-gray-200"
                  }`}>
                    🖼
                  </div>
                )}
                <span className="font-medium text-sm leading-tight">{col.name}</span>
                {selectedCollection === col.id && (
                  <svg className="w-4 h-4 ml-auto flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid 2 — Categories */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Categorias</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedCollectionName ?? "Escolha uma linha"}
            </p>
          </div>
          <div className="p-3">
            {loadingCategories ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Carregando...
              </div>
            ) : !selectedCollection ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-300 gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs">Selecione uma linha</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Sem categorias
              </div>
            ) : (
              <div className="space-y-1 max-h-[560px] overflow-y-auto">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory((prev) => prev === cat.id ? null : cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all text-left ${
                        isActive
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-100 hover:border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      {cat.image_url ? (
                        <div
                          className="w-8 h-8 rounded-lg flex-shrink-0 bg-cover bg-center"
                          style={{ backgroundImage: `url('${cat.image_url}')` }}
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 ${isActive ? "bg-white/20" : "bg-gray-200"}`} />
                      )}
                      <span className="text-xs font-medium truncate">{cat.name}</span>
                      {isActive && (
                        <svg className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Grid 3 — Estampas */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Estampas</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedCategoryName
                ? `${selectedCategoryName} — ${estampas.length} imagem${estampas.length !== 1 ? "s" : ""}`
                : "Escolha uma categoria"}
            </p>
          </div>
          <div className="p-3">
            {loadingEstampas ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Carregando estampas...
              </div>
            ) : !selectedCategory ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-300 gap-2">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs">Selecione uma categoria</span>
              </div>
            ) : estampas.length === 0 ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                Sem estampas nesta categoria
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 gap-2 max-h-[560px] overflow-y-auto pr-0.5">
                {estampas.map((est) => (
                  <button
                    key={est.id}
                    onClick={() => setLightbox(est)}
                    title={est.nome}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 hover:ring-2 hover:ring-gray-900 transition-all"
                  >
                    {est.imagem_url ? (
                      <img
                        src={est.imagem_url}
                        alt={est.nome}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] p-1 text-center leading-tight">
                        {est.nome}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.imagem_url && (
              <div className="w-full bg-gray-50" style={{ maxHeight: "72vh" }}>
                <img
                  src={lightbox.imagem_url}
                  alt={lightbox.nome}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: "72vh" }}
                />
              </div>
            )}
            <div className="px-5 py-3 flex items-center justify-between border-t border-gray-100 gap-4">
              <span className="text-sm text-gray-700 truncate">{lightbox.nome}</span>
              <button
                onClick={() => setLightbox(null)}
                className="flex-shrink-0 text-xs text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
