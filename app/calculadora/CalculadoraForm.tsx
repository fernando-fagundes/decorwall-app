"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Produto {
  id: string; name: string;
  preco_m2: number;
  preco_consumidor_m2: number | null;
  largura_min: number; largura_max: number;
  altura_min: number; altura_max: number;
}
interface Deducao { id: string; tipo: "Porta" | "Janela" | "Outro"; largura: string; altura: string; }
interface Parede { id: string; nome: string; largura: string; altura: string; produto_id: string; produto_nome: string; preco_m2: number; deducoes: Deducao[]; }

type TipoPreco = "lojista" | "consumidor";

function uid() { return Math.random().toString(36).slice(2, 9); }
function n(v: string) { return parseFloat(v) || 0; }
function areaBruta(p: Parede) { return (n(p.largura) * n(p.altura)) / 10000; }
function areaDeducoes(p: Parede) { return p.deducoes.reduce((acc, d) => acc + (n(d.largura) * n(d.altura)) / 10000, 0); }
function areaLiquida(p: Parede) { return Math.max(0, areaBruta(p) - areaDeducoes(p)); }
function subtotal(p: Parede) { return areaLiquida(p) * p.preco_m2; }
function fmt(v: number) { return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function getPreco(prod: Produto, tipo: TipoPreco): number {
  if (tipo === "consumidor") return prod.preco_consumidor_m2 ?? prod.preco_m2;
  return prod.preco_m2;
}

function newParede(num: number, produto?: Produto, tipo: TipoPreco = "lojista"): Parede {
  return {
    id: uid(), nome: `Parede ${num}`, largura: "", altura: "",
    produto_id: produto?.id ?? "", produto_nome: produto?.name ?? "",
    preco_m2: produto ? getPreco(produto, tipo) : 0,
    deducoes: [],
  };
}

export default function CalculadoraForm() {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  function getSupabase() { if (!supabaseRef.current) supabaseRef.current = createClient(); return supabaseRef.current; }

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paredes, setParedes] = useState<Parede[]>([newParede(1)]);
  const [tipoPreco, setTipoPreco] = useState<TipoPreco>("lojista");

  useEffect(() => {
    getSupabase()
      .from("products")
      .select("id, name, preco_m2, preco_consumidor_m2, largura_min, largura_max, altura_min, altura_max")
      .order("name")
      .then(({ data }) => {
        if (data) { setProdutos(data); setParedes([newParede(1, data[0], tipoPreco)]); }
      });
  }, []);

  function handleTipoPreco(novoTipo: TipoPreco) {
    setTipoPreco(novoTipo);
    setParedes(ps => ps.map(p => {
      const prod = produtos.find(pr => pr.id === p.produto_id);
      if (!prod) return p;
      return { ...p, preco_m2: getPreco(prod, novoTipo) };
    }));
  }

  function updateParede(id: string, fields: Partial<Parede>) {
    setParedes(ps => ps.map(p => p.id === id ? { ...p, ...fields } : p));
  }
  function setProdutoParede(paredeId: string, produtoId: string) {
    const prod = produtos.find(p => p.id === produtoId);
    if (prod) updateParede(paredeId, { produto_id: prod.id, produto_nome: prod.name, preco_m2: getPreco(prod, tipoPreco) });
  }
  function addDeducao(paredeId: string, tipo: Deducao["tipo"]) {
    setParedes(ps => ps.map(p => p.id === paredeId ? { ...p, deducoes: [...p.deducoes, { id: uid(), tipo, largura: "", altura: "" }] } : p));
  }
  function updateDeducao(paredeId: string, deducaoId: string, fields: Partial<Deducao>) {
    setParedes(ps => ps.map(p => p.id === paredeId ? { ...p, deducoes: p.deducoes.map(d => d.id === deducaoId ? { ...d, ...fields } : d) } : p));
  }
  function removeDeducao(paredeId: string, deducaoId: string) {
    setParedes(ps => ps.map(p => p.id === paredeId ? { ...p, deducoes: p.deducoes.filter(d => d.id !== deducaoId) } : p));
  }

  const totalM2 = paredes.reduce((acc, p) => acc + areaLiquida(p), 0);
  const totalGeral = paredes.reduce((acc, p) => acc + subtotal(p), 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Calculadora de Orçamento</h1>

        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
          <button
            onClick={() => handleTipoPreco("lojista")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tipoPreco === "lojista" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"}`}
          >
            Preco Lojista
          </button>
          <button
            onClick={() => handleTipoPreco("consumidor")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tipoPreco === "consumidor" ? "bg-white text-gray-900 shadow" : "text-gray-500 hover:text-gray-700"}`}
          >
            Preco Consumidor
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {paredes.map((parede) => (
          <div key={parede.id} className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">{parede.nome}</h2>
              {paredes.length > 1 && (
                <button onClick={() => setParedes(ps => ps.filter(p => p.id !== parede.id))} className="text-red-500 hover:text-red-700 text-sm">Remover</button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label>
                <input type="number" value={parede.largura} onChange={e => updateParede(parede.id, { largura: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Ex: 350" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                <input type="number" value={parede.altura} onChange={e => updateParede(parede.id, { altura: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Ex: 280" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
              <select value={parede.produto_id} onChange={e => setProdutoParede(parede.id, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                <option value="">Selecione um produto</option>
                {produtos.map(p => {
                  const preco = getPreco(p, tipoPreco);
                  return <option key={p.id} value={p.id}>{p.name} — R$ {fmt(preco)}/m2</option>;
                })}
              </select>
            </div>

            {parede.deducoes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Descontos</h3>
                {parede.deducoes.map(d => (
                  <div key={d.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <span className="text-sm font-medium text-gray-600 w-16">{d.tipo}</span>
                    <input type="number" value={d.largura} onChange={e => updateDeducao(parede.id, d.id, { largura: e.target.value })}
                      className="w-24 border rounded px-2 py-1 text-sm" placeholder="Larg cm" />
                    <span className="text-gray-400 text-sm">x</span>
                    <input type="number" value={d.altura} onChange={e => updateDeducao(parede.id, d.id, { altura: e.target.value })}
                      className="w-24 border rounded px-2 py-1 text-sm" placeholder="Alt cm" />
                    <button onClick={() => removeDeducao(parede.id, d.id)} className="ml-auto text-red-400 hover:text-red-600 text-lg leading-none">x</button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <button onClick={() => addDeducao(parede.id, "Porta")} className="text-xs px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50">+ Porta</button>
              <button onClick={() => addDeducao(parede.id, "Janela")} className="text-xs px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50">+ Janela</button>
              <button onClick={() => addDeducao(parede.id, "Outro")} className="text-xs px-3 py-1 border border-gray-300 rounded-full hover:bg-gray-50">+ Outro</button>
            </div>

            {areaBruta(parede) > 0 && (
              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800 space-y-1">
                <div className="flex justify-between"><span>Area bruta:</span><span>{fmt(areaBruta(parede))} m2</span></div>
                {parede.deducoes.length > 0 && <div className="flex justify-between"><span>Deducoes:</span><span>- {fmt(areaDeducoes(parede))} m2</span></div>}
                <div className="flex justify-between font-semibold"><span>Area liquida:</span><span>{fmt(areaLiquida(parede))} m2</span></div>
                {parede.preco_m2 > 0 && <div className="flex justify-between font-semibold text-blue-900 border-t border-blue-200 pt-1 mt-1"><span>Subtotal:</span><span>R$ {fmt(subtotal(parede))}</span></div>}
              </div>
            )}
          </div>
        ))}

        <button onClick={() => setParedes(ps => [...ps, newParede(ps.length + 1, produtos[0], tipoPreco)])}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm font-medium">
          + Adicionar parede
        </button>
      </div>

      {totalGeral > 0 && (
        <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Resumo do Orcamento</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${tipoPreco === "consumidor" ? "bg-purple-600" : "bg-blue-600"}`}>
              {tipoPreco === "consumidor" ? "Preco Consumidor" : "Preco Lojista"}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{paredes.filter(p => areaLiquida(p) > 0).length}</div>
              <div className="text-xs text-gray-400 mt-1">Total de paredes</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{fmt(totalM2)}</div>
              <div className="text-xs text-gray-400 mt-1">Total m2</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">R$ {fmt(totalGeral)}</div>
              <div className="text-xs text-gray-400 mt-1">Valor total</div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setParedes([newParede(1, produtos[0], tipoPreco)])}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">Limpar</button>
            <a href="/pedido" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">Converter em pedido</a>
          </div>
        </div>
      )}
    </div>
  );
}
