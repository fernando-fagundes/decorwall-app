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

interface Item {
  produto: string;
  quantidade: string;
  descricao: string;
}

interface Props {
  userId: string;
  vendedorNome: string;
}

export default function PedidoForm({ userId }: Props) {
  // Produtos do banco
  const [produtos, setProdutos] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("name")
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const nomes = data.map((p) => p.name);
          setProdutos([...nomes, "Outros"]);
        }
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
  const [itens, setItens] = useState<Item[]>([
    { produto: "", quantidade: "", descricao: "" },
  ]);

  // Atualiza o produto padrão do primeiro item quando os produtos carregam
  useEffect(() => {
    if (produtos.length > 0 && itens[0].produto === "") {
      setItens((prev) => [{ ...prev[0], produto: produtos[0] }, ...prev.slice(1)]);
    }
  }, [produtos]);

  // Pagamento / observações
  const [condicao, setCondicao] = useState(CONDICOES[0]);
  const [observacoes, setObservacoes] = useState("");

  // Submit
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  // ── CNPJ lookup ──────────────────────────────────────────────
  function formatCnpj(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
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
      if (!res.ok) throw new Error("CNPJ não encontrado");
      const d = await res.json();
      setRazaoSocial(d.razao_social || "");
      const end = [d.logradouro, d.numero, d.complemento].filter(Boolean).join(", ");
      setEndereco(end);
      setCidade(d.municipio || "");
      setEstado(d.uf || "");
    } catch {
      setCnpjError("CNPJ não encontrado ou inválido.");
      setRazaoSocial("");
      setEndereco("");
      setCidade("");
      setEstado("");
    } finally {
      setCnpjLoading(false);
    }
  }

  // ── Itens ─────────────────────────────────────────────────────
  function updateItem(idx: number, field: keyof Item, value: string) {
    setItens((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItens((prev) => [...prev, { produto: produtos[0] || "", quantidade: "", descricao: "" }]);
  }

  function removeItem(idx: number) {
    setItens((prev) => prev.filter((_, i) => i !== idx));
  }

  // ── Submit ────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const cnpjDigits = cnpj.replace(/\D/g, "");
    if (cnpjDigits.length !== 14) {
      setErro("Informe um CNPJ válido (14 dígitos).");
      return;
    }
    if (itens.some((it) => !it.quantidade)) {
      setErro("Preencha a quantidade de todos os itens.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("pedidos").insert({
      user_id: userId,
      cnpj: cnpjDigits,
      razao_social: razaoSocial,
      endereco,
      cidade,
      estado,
      itens,
      condicao_pagamento: condicao,
      observacoes,
    });

    setLoading(false);
    if (error) {
      setErro("Erro ao salvar pedido: " + error.message);
    } else {
      setSucesso(true);
    }
  }

  // ── Sucesso ───────────────────────────────────────────────────
  if (sucesso) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido registrado com sucesso!</h2>
        <p className="text-gray-500 mb-6">Em breve nossa equipe entrará em contato.</p>
        <button
          onClick={() => {
            setSucesso(false);
            setCnpj(""); setRazaoSocial(""); setEndereco(""); setCidade(""); setEstado("");
            setItens([{ produto: produtos[0] || "", quantidade: "", descricao: "" }]);
            setCondicao(CONDICOES[0]);
            setObservacoes("");
          }}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Novo pedido
        </button>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* CNPJ */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">1. Dados do cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">CNPJ</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                onBlur={() => buscarCnpj(cnpj)}
                placeholder="00.000.000/0000-00"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                required
              />
              {cnpjLoading && <span className="self-center text-xs text-gray-400">Buscando...</span>}
            </div>
            {cnpjError && <p className="text-xs text-red-500 mt-1">{cnpjError}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Razão Social</label>
            <input
              type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Endereço</label>
            <input
              type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Cidade</label>
            <input
              type="text" value={cidade} onChange={(e) => setCidade(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <input
              type="text" value={estado} onChange={(e) => setEstado(e.target.value)}
              maxLength={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Itens */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">2. Produtos</h2>
        <div className="space-y-4">
          {itens.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 items-start border border-gray-100 rounded-xl p-4">
              <div className="col-span-12 sm:col-span-4">
                <label className="block text-xs text-gray-500 mb-1">Produto</label>
                <select
                  value={item.produto}
                  onChange={(e) => updateItem(idx, "produto", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {produtos.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Qtd</label>
                <input
                  type="number" min="1" value={item.quantidade}
                  onChange={(e) => updateItem(idx, "quantidade", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div className="col-span-8 sm:col-span-5">
                <label className="block text-xs text-gray-500 mb-1">Descrição / medida</label>
                <input
                  type="text" value={item.descricao}
                  onChange={(e) => updateItem(idx, "descricao", e.target.value)}
                  placeholder="ex: 2,70m x 1,50m, cor azul..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="col-span-12 sm:col-span-1 flex items-end justify-end pb-1">
                {itens.length > 1 && (
                  <button type="button" onClick={() => removeItem(idx)}
                    className="text-gray-400 hover:text-red-500 text-lg leading-none" title="Remover">×</button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem}
          className="mt-4 text-sm text-gray-600 border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
          + Adicionar produto
        </button>
      </section>

      {/* Pagamento */}
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

      <button type="submit" disabled={loading || produtos.length === 0}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
        {loading ? "Enviando pedido..." : "Enviar pedido"}
      </button>
    </form>
  );
}
