"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface Produto {
  id: string;
  name: string;
  preco_m2: number;
  largura_min: number;
  largura_max: number;
  altura_min: number;
  altura_max: number;
}

interface Deducao {
  id: string;
  tipo: "Porta" | "Janela" | "Outro";
  largura: string;
  altura: string;
}

interface Parede {
  id: string;
  nome: string;
  largura: string;
  altura: string;
  produto_id: string;
  produto_nome: string;
  preco_m2: number;
  deducoes: Deducao[];
  layout_url?: string;
  layoutUploading?: boolean;
}

interface Props {
  userId?: string | null;
}

function uid() { return Math.random().toString(36).slice(2, 9); }
function n(v: string) { return parseFloat(v) || 0; }
function areaBruta(p: Parede) { return (n(p.largura) * n(p.altura)) / 10000; }
function areaDeducoes(p: Parede) { return p.deducoes.reduce((acc, d) => acc + (n(d.largura) * n(d.altura)) / 10000, 0); }
function areaLiquida(p: Parede) { return Math.max(0, areaBruta(p) - areaDeducoes(p)); }
function subtotal(p: Parede) { return areaLiquida(p) * p.preco_m2; }
function fmt(v: number) { return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

function newParede(num: number, produto?: Produto): Parede {
  return {
    id: uid(),
    nome: `Parede ${num}`,
    largura: "",
    altura: "",
    produto_id: produto?.id ?? "",
    produto_nome: produto?.name ?? "",
    preco_m2: produto?.preco_m2 ?? 0,
    deducoes: [],
  };
}

export default function PedidoForm({ userId }: Props) {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  function getSupabase() {
    if (!supabaseRef.current) supabaseRef.current = createClient();
    return supabaseRef.current;
  }

  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cnpjError, setCnpjError] = useState("");

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paredes, setParedes] = useState<Parede[]>([]);
  const [transportadora, setTransportadora] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    getSupabase()
      .from("products")
      .select("id, name, preco_m2, largura_min, largura_max, altura_min, altura_max")
      .order("display_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProdutos(data);
          setParedes([newParede(1, data[0])]);
        } else {
          setParedes([newParede(1)]);
        }
      });
  }, []);

  function formatCnpj(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 14);
    return d
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function formatTelefone(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 10) {
      return d.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    }
    return d.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  }

  async function buscarCnpj(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (digits.length !== 14) return;
    setCnpjLoading(true);
    setCnpjError("");
    try {
      const res = await fetch("/api/cnpj?cnpj=" + digits);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setRazaoSocial(d.razao_social || "");
      setEndereco([d.logradouro, d.numero, d.complemento].filter(Boolean).join(", "));
      setCidade(d.municipio || "");
      setEstado(d.uf || "");
      if (d.ddd_telefone_1) setTelefone(formatTelefone(d.ddd_telefone_1));
    } catch {
      setCnpjError("CNPJ nao encontrado ou invalido.");
      setRazaoSocial(""); setEndereco(""); setCidade(""); setEstado("");
    } finally {
      setCnpjLoading(false);
    }
  }

  function updateParede(id: string, patch: Partial<Parede>) {
    setParedes((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }
  function addParede() { setParedes((prev) => [...prev, newParede(prev.length + 1, produtos[0])]); }
  function removeParede(id: string) { setParedes((prev) => prev.filter((p) => p.id !== id)); }
  function selectProduto(paredeId: string, produtoId: string) {
    const prod = produtos.find((p) => p.id === produtoId);
    if (prod) updateParede(paredeId, { produto_id: prod.id, produto_nome: prod.name, preco_m2: prod.preco_m2 });
  }
  function addDeducao(paredeId: string, tipo: Deducao["tipo"]) {
    setParedes((prev) => prev.map((p) =>
      p.id === paredeId && p.deducoes.length === 0
        ? { ...p, deducoes: [{ id: uid(), tipo, largura: "", altura: "" }] }
        : p
    ));
  }
  function updateDeducao(paredeId: string, deducaoId: string, patch: Partial<Deducao>) {
    setParedes((prev) => prev.map((p) =>
      p.id === paredeId
        ? { ...p, deducoes: p.deducoes.map((d) => (d.id === deducaoId ? { ...d, ...patch } : d)) }
        : p
    ));
  }
  function removeDeducao(paredeId: string, deducaoId: string) {
    setParedes((prev) => prev.map((p) =>
      p.id === paredeId ? { ...p, deducoes: p.deducoes.filter((d) => d.id !== deducaoId) } : p
    ));
  }

  async function uploadLayout(paredeId: string, file: File) {
    updateParede(paredeId, { layoutUploading: true });
    try {
      const ext = file.name.split(".").pop();
      const path = (userId || "anonimo") + "/" + paredeId + "-" + Date.now() + "." + ext;
      const { error } = await getSupabase().storage.from("layouts").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = getSupabase().storage.from("layouts").getPublicUrl(path);
      updateParede(paredeId, { layout_url: data.publicUrl, layoutUploading: false });
    } catch {
      updateParede(paredeId, { layoutUploading: false });
    }
  }

  const totalGeral = paredes.reduce((acc, p) => acc + subtotal(p), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    const cnpjDigits = cnpj.replace(/\D/g, "");
    if (cnpjDigits.length !== 14) { setErro("Informe um CNPJ valido."); return; }
    if (paredes.length === 0) { setErro("Adicione ao menos uma parede."); return; }
    for (const p of paredes) {
      if (!n(p.largura) || !n(p.altura)) { setErro(`Informe medidas de "${p.nome}".`); return; }
      if (!p.produto_id) { setErro(`Selecione produto de "${p.nome}".`); return; }
    }
    const itens = paredes.map((p) => ({
      nome: p.nome, produto_id: p.produto_id, produto_nome: p.produto_nome, preco_m2: p.preco_m2,
      largura_cm: n(p.largura), altura_cm: n(p.altura),
      area_bruta: parseFloat(areaBruta(p).toFixed(4)),
      deducoes: p.deducoes.map((d) => ({
        tipo: d.tipo, largura_cm: n(d.largura), altura_cm: n(d.altura),
        area: parseFloat(((n(d.largura) * n(d.altura)) / 10000).toFixed(4)),
      })),
      area_deducoes: parseFloat(areaDeducoes(p).toFixed(4)),
      area_liquida: parseFloat(areaLiquida(p).toFixed(4)),
      subtotal: parseFloat(subtotal(p).toFixed(2)),
      layout_url: p.layout_url || null,
    }));
    setLoading(true);
    try {
      const res = await fetch("/api/pedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cnpjDigits, razaoSocial, endereco, cidade, estado, telefone,
          itens, valorTotal: parseFloat(totalGeral.toFixed(2)),
          transportadora, observacoes, userId: userId || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) { setErro(json.error || "Erro ao enviar pedido."); }
      else { setNumeroPedido(json.numero ?? ""); setSucesso(true); }
    } catch {
      setErro("Erro de conexao. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSucesso(false); setNumeroPedido("");
    setCnpj(""); setRazaoSocial(""); setEndereco(""); setCidade(""); setEstado(""); setTelefone("");
    setParedes([newParede(1, produtos[0])]); setObservacoes(""); setTransportadora("");
  }

  if (sucesso) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="text-5xl mb-4">&#10003;</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pedido registrado!</h2>
        {numeroPedido && (
          <p className="text-3xl font-bold text-gray-900 my-4 tracking-widest">{numeroPedido}</p>
        )}
        <p className="text-gray-500 mb-6">Em breve nossa equipe entrara em contato.</p>
        <button onClick={resetForm} className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Novo pedido
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">1. Dados do cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">CNPJ</label>
            <div className="flex gap-2">
              <input type="text" value={cnpj}
                onChange={(e) => { const f = formatCnpj(e.target.value); setCnpj(f); if (f.replace(/\D/g, "").length === 14) buscarCnpj(f); }}
                onBlur={() => buscarCnpj(cnpj)} placeholder="00.000.000/0000-00"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
              {cnpjLoading && <span className="self-center text-xs text-gray-400">Buscando...</span>}
            </div>
            {cnpjError && <p className="text-xs text-red-500 mt-1">{cnpjError}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Razao Social</label>
            <input type="text" value={razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" required />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Endereco</label>
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
            <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Telefone</label>
            <input type="text" value={telefone} onChange={(e) => setTelefone(formatTelefone(e.target.value))}
              placeholder="(00) 00000-0000"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-1">2. Paredes</h2>
        <p className="text-xs text-gray-400 mb-5">Medidas em centimetros. Um desconto por parede.</p>
        <div className="space-y-6">
          {paredes.map((parede, idx) => {
            const bruta = areaBruta(parede);
            const ded = areaDeducoes(parede);
            const liq = areaLiquida(parede);
            const sub = subtotal(parede);
            return (
              <div key={parede.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-6">{idx + 1}</span>
                  <input type="text" value={parede.nome} onChange={(e) => updateParede(parede.id, { nome: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-medium text-gray-800 focus:outline-none border-b border-transparent focus:border-gray-400" />
                  {paredes.length > 1 && (
                    <button type="button" onClick={() => removeParede(parede.id)} className="text-gray-300 hover:text-red-400 text-xl leading-none transition-colors">x</button>
                  )}
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Largura (cm)</label>
                      <input type="number" min="0" step="1" value={parede.largura}
                        onChange={(e) => updateParede(parede.id, { largura: e.target.value })} placeholder="ex: 350"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Altura (cm)</label>
                      <input type="number" min="0" step="1" value={parede.altura}
                        onChange={(e) => updateParede(parede.id, { altura: e.target.value })} placeholder="ex: 270"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Produto</label>
                      <select value={parede.produto_id} onChange={(e) => selectProduto(parede.id, e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                        {produtos.length === 0 && <option value="">Carregando...</option>}
                        {produtos.map((p) => <option key={p.id} value={p.id}>{p.name} - R$ {fmt(p.preco_m2)}/m2</option>)}
                      </select>
                    </div>
                  </div>
                  {parede.deducoes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Desconto</p>
                      {parede.deducoes.map((d) => (
                        <div key={d.id} className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                          <span className="text-xs font-medium text-orange-600 w-14 shrink-0">{d.tipo}</span>
                          <div className="flex items-center gap-1 flex-1">
                            <input type="number" min="0" step="1" value={d.largura}
                              onChange={(e) => updateDeducao(parede.id, d.id, { largura: e.target.value })} placeholder="Larg."
                              className="w-20 border border-orange-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
                            <span className="text-gray-400 text-xs">x</span>
                            <input type="number" min="0" step="1" value={d.altura}
                              onChange={(e) => updateDeducao(parede.id, d.id, { altura: e.target.value })} placeholder="Alt."
                              className="w-20 border border-orange-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-orange-400" />
                            <span className="text-gray-400 text-xs">cm</span>
                            {n(d.largura) && n(d.altura) ? (
                              <span className="text-orange-500 text-xs ml-1">-{fmt((n(d.largura) * n(d.altura)) / 10000)} m2</span>
                            ) : null}
                          </div>
                          <button type="button" onClick={() => removeDeducao(parede.id, d.id)} className="text-orange-300 hover:text-red-400 text-lg leading-none">x</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {parede.deducoes.length === 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-400 mr-1">Desconto:</span>
                      <button type="button" onClick={() => addDeducao(parede.id, "Porta")} className="text-xs border border-dashed border-orange-300 text-orange-500 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors">+ Porta</button>
                      <button type="button" onClick={() => addDeducao(parede.id, "Janela")} className="text-xs border border-dashed border-orange-300 text-orange-500 rounded-lg px-3 py-1.5 hover:bg-orange-50 transition-colors">+ Janela</button>
                      <button type="button" onClick={() => addDeducao(parede.id, "Outro")} className="text-xs border border-dashed border-gray-200 text-gray-400 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">+ Outro</button>
                    </div>
                  )}
                  {bruta > 0 && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
                      <span>Area bruta: <strong className="text-gray-700">{fmt(bruta)} m2</strong></span>
                      {ded > 0 && <span>Desconto: <strong className="text-orange-600">-{fmt(ded)} m2</strong></span>}
                      <span>Area liquida: <strong className="text-gray-700">{fmt(liq)} m2</strong></span>
                      <span className="ml-auto text-sm font-semibold text-gray-800">R$ {fmt(sub)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
                    <label className={`cursor-pointer flex items-center gap-1.5 text-xs border border-dashed rounded-lg px-3 py-1.5 transition-colors ${parede.layoutUploading ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-blue-300 text-blue-500 hover:bg-blue-50"}`}>
                      <input type="file" accept="image/*,.pdf" className="hidden" disabled={!!parede.layoutUploading}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLayout(parede.id, f); e.target.value = ""; }} />
                      {parede.layoutUploading ? "Enviando..." : parede.layout_url ? "Trocar layout" : "+ Anexar layout"}
                    </label>
                    {parede.layout_url && (
                      <a href={parede.layout_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-xs">Ver layout</a>
                    )}
                    {parede.layout_url && (
                      <button type="button" onClick={() => updateParede(parede.id, { layout_url: undefined })} className="text-xs text-gray-400 hover:text-red-400 transition-colors">remover</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button type="button" onClick={addParede} className="mt-5 text-sm text-gray-600 border border-dashed border-gray-300 rounded-xl px-4 py-2.5 w-full hover:bg-gray-50 transition-colors">
          + Adicionar parede
        </button>
        {paredes.length > 0 && totalGeral > 0 && (
          <div className="mt-4 flex justify-between items-center bg-gray-900 text-white rounded-xl px-5 py-3">
            <span className="text-sm font-medium">Total geral</span>
            <span className="text-lg font-bold">R$ {fmt(totalGeral)}</span>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">3. Entrega e observacoes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Transportadora</label>
            <input type="text" value={transportadora} onChange={(e) => setTransportadora(e.target.value)}
              placeholder="Nome da transportadora ou retirada na loja..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Observacoes</label>
            <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3}
              placeholder="Prazo de entrega, informacoes adicionais..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
          </div>
        </div>
      </section>

      {erro && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{erro}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
        {loading ? "Enviando pedido..." : "Enviar pedido"}
      </button>
    </form>
  );
}
