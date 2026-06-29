"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const CONDICOES = [
  "À vista (PIX)",
  "Boleto 30 dias",
  "Boleto 30/60",
  "Boleto 30/60/90",
  "Cartão de Crédito",
];

interface Produto {
  id: string;
  name: string;
  preco_m2: number;
  largura_min: number;
  largura_max: number;
  altura_min: number;
  altura_max: number;
}

interface Item {
  produto_id: string;
  produto_nome: string;
  largura: string;
  altura: string;
  quantidade: string;
  descricao: string;
  preco_m2: number;
  subtotal: number;
}

interface Props {
  userId: string;
  vendedorNome: string;
}

function calcSubtotal(item: Item): number {
  const l = parseFloat(item.largura) || 0;
  const h = parseFloat(item.altura) || 0;
  const q = parseInt(item.quantidade) || 1;
  const area = l * h;
  return area * q * item.preco_m2;
}

export default function PedidoForm({ userId }: Props) {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("id, name, preco_m2, largura_min, largura_max, altura_min, altura_max")
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) setProdutos(data);
      });
  }, []);

  // CNPJ
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState("");

  // Itens
  const [itens, setItens] = useState<Item[]>([]);

  useEffect(() => {
    if (produtos.length > 0 && itens.length === 0) {
      const p = produtos[0];
      setItens([{
        produto_id: p.id,
        produto_nome: p.name,
        largura: "",
        altura: "",
        quantidade: "1",
        descricao: "",
        preco_m2: p.preco_m2 || 0,
        subtotal: 0,
      }]);
    }
  }, [produtos]);

  const totalGeral = itens.reduce((acc, it) => acc + calcSubtotal(it), 0);

  // Pagamento
  const [condicao, setCondicao] = useState(CONDICOES[0]);
  const [observacoes, setObservacoes] = useState("");

  // Submit
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  // ── CNPJ ──────────────────────────────────────────────────────
  function formatCnpj(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 14);
    return d
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  async function buscarCnpj(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 14) return;
    setCnpjLoading(true);
    setCnpjError("");
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setRazaoSocial(d.razao_social || "");
      setEndereco([d.logradouro, d.numero, d.complemento].filter(Boolean).join(", "));
      setCidade(d.municipio || "");
      setEstado(d.uf || "");
    } catch {
      setCnpjError("CNPJ não encontrado ou inválido.");
    } finally {
      setCnpjLoading(false);
    }
  }

  // ── Itens ─────────────────────────────────────────────────────
  function updateItem(idx: number, field: keyof Item, value: string) {
    setItens((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it;
        const updated = { ...it, [field]: value };
        if (field === "produto_id") {
          const p = produtos.find((p) => p.id === value);
          if (p) {
            updated.produto_nome = p.name;
            updated.preco_m2 = p.preco_m2 || 0;
          }
        }
        updated.subtotal = calcSubtotal(updated);
        return updated;
      })
    );
  }

  function addItem() {
    const p = produtos[0];
    if (!p) return;
    setItens((prev) => [...prev, {
      produto_id: p.id,
      produto_nome: p.name,
      largura: "",
      altura: "",
      quantidade: "1",
      descricao: "",
      preco_m2: p.preco_m2 || 0,
      subtotal: 0,
    }]);
  }

  function removeItem(idx: number) {
    setItens((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const cnpjDigits = cnpj.replace(/\D/g, "");
    if (cnpjDigits.length !== 14) { setErro("Informe um CNPJ válido."); return; }
    if (itens.some((it) => !it.largura || !it.altura || !it.quantidade)) {
      setErro("Preencha largura, altura e quantidade de todos os itens.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("pedidos").insert({
      user_id: userId,
      cnpj: cnpjDigits,
      razao_social: razaoSocial,
      endereco, cidade, estado,
      itens: itens.map((it) => ({
        produto_id: it.produto_id,
        produto_nome: it.produto_nome,
        largura: parseFloat(it.largura),
        altura: parseFloat(it.altura),
        quantidade: parseInt(it.quantidade),
        area_m2: (parseFloat(it.largura) * parseFloat(it.altura)),
        preco_m2: it.preco_m2,
        subtotal: calcSubtotal(it),
        descricao: it.descricao,
      })),
      valor_total: totalGeral,
      condicao_pagamento: condicao,
      observacoes,
    });

    setLoading(false);
    if (error) { setErro("Erro ao salvar pedido: " + error.message); }
    else { setSucesso(true); }
  }

  // ── Sucesso ───────────────────────────────────────────────────
  if (sucesso) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido registrado com sucesso!</h2>
        <p className="text-gray-500 mb-6">
          {totalGeral > 0 && `Valor total: R$ ${totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
        </p>
        <button
          onClick={() => { setSucesso(false); setCnpj(""); setRazaoSocial(""); setEndereco(""); setCidade(""); setEstado(""); setItens([]); setCondicao(CONDICOES[0]); setObservacoes(""); }}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Novo pedido
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  const produtoAtual = (idx: number) => produtos.find((p) => p.id === itens[idx]?.produto_id);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* 1. Dados do cliente */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">1. Dados do cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">CNPJ</label>
            <div className="flex gap-2">
              <input type="text" value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                onBlur={() => buscarCnpj(cnpj)}
                placeholder="00.000.000/0000-00"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
              {cnpjLoading && <span className="self-center text-xs text-gray-400">Buscando...</span>}
            </div>
            {cnpjError && <p className="text-xs text-red-500 mt-1">{cnpjError}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Razão Social</label>
            <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Endereço</label>
            <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Cidade</label>
            <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)}
              maxLength={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
        </div>
      </section>

      {/* 2. Produtos */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">2. Produtos e medidas</h2>
        <div className="space-y-4">
          {itens.map((item, idx) => {
            const p = produtoAtual(idx);
            const area = (parseFloat(item.largura) || 0) * (parseFloat(item.altura) || 0);
            const sub = calcSubtotal(item);
            return (
              <div key={idx} className="border border-gray-100 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-12 gap-3 items-end">
                  {/* Produto */}
                  <div className="col-span-12 sm:col-span-5">
                    <label className="block text-xs text-gray-500 mb-1">Produto</label>
                    <select value={item.produto_id} onChange={(e) => updateItem(idx, "produto_id", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                      {produtos.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    {p && p.preco_m2 > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        R$ {p.preco_m2.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}/m²
                        {p.largura_min > 0 && ` · Largura: ${p.largura_min}–${p.largura_max}m`}
                        {p.altura_min > 0 && ` · Altura: ${p.altura_min}–${p.altura_max}m`}
                      </p>
                    )}
                  </div>

                  {/* Largura */}
                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Largura (m)</label>
                    <input type="number" min="0" step="0.01" value={item.largura}
                      onChange={(e) => updateItem(idx, "largura", e.target.value)}
                      placeholder="ex: 2.50"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                  </div>

                  {/* Altura */}
                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Altura (m)</label>
                    <input type="number" min="0" step="0.01" value={item.altura}
                      onChange={(e) => updateItem(idx, "altura", e.target.value)}
                      placeholder="ex: 2.70"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                  </div>

                  {/* Qtd */}
                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">Qtd</label>
                    <input type="number" min="1" value={item.quantidade}
                      onChange={(e) => updateItem(idx, "quantidade", e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 flex items-end pb-2">
                    {itens.length > 1 && (
                      <button type="button" onClick={() => removeItem(idx)}
                        className="text-gray-400 hover:text-red-500 text-xl leading-none">×</button>
                    )}
                  </div>
                </div>

                {/* Descrição + subtotal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Descrição / observação</label>
                    <input type="text" value={item.descricao}
                      onChange={(e) => updateItem(idx, "descricao", e.target.value)}
                      placeholder="ex: cor, ambiente, referência..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                  </div>
                  <div className="text-right">
                    {area > 0 && (
                      <p className="text-xs text-gray-400">{area.toFixed(2)} m²</p>
                    )}
                    {sub > 0 && (
                      <p className="text-sm font-semibold text-gray-800">
                        R$ {sub.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4">
          <button type="button" onClick={addItem}
            className="text-sm text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
            + Adicionar produto
          </button>
          {totalGeral > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Total estimado</p>
              <p className="text-lg font-bold text-gray-900">
                R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Pagamento */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">3. Pagamento e observações</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Condição de pagamento</label>
            <select value={condicao} onChange={(e) => setCondicao(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required>
              {CONDICOES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Observações</label>
            <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)}
              rows={3} placeholder="Prazo de entrega, informações adicionais..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
          </div>
        </div>
      </section>

      {erro && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</p>
      )}

      <button type="submit" disabled={loading || itens.length === 0}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
        {loading ? "Enviando pedido..." : `Enviar pedido${totalGeral > 0 ? ` — R$ ${totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}`}
      </button>
    </form>
  );
}
