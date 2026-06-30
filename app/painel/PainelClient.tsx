"use client";

import { useState } from "react";
import PedidoCard from "./PedidoCard";

type Filtro = "pendente" | "aprovado" | "recusado" | "todos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Pedido = Record<string, any>;

interface Props {
  pedidos: Pedido[];
  isGestor: boolean;
  nomeUsuario: string;
}

export default function PainelClient({ pedidos, isGestor, nomeUsuario }: Props) {
  const [filtro, setFiltro] = useState<Filtro>("pendente");

  const total = pedidos.length;
  const pendentes = pedidos.filter(p => p.status === "pendente").length;
  const aprovados = pedidos.filter(p => p.status === "aprovado").length;
  const recusados = pedidos.filter(p => p.status === "recusado").length;

  const pedidosFiltrados = filtro === "todos"
    ? pedidos
    : pedidos.filter(p => p.status === filtro);

  const cards = [
    { label: "Total", valor: total, filtro: "todos" as Filtro, cor: "text-gray-800", corAtivo: "bg-gray-900 text-white border-gray-900" },
    { label: "Pendentes", valor: pendentes, filtro: "pendente" as Filtro, cor: "text-yellow-600", corAtivo: "bg-yellow-500 text-white border-yellow-500" },
    { label: "Aprovados", valor: aprovados, filtro: "aprovado" as Filtro, cor: "text-green-600", corAtivo: "bg-green-600 text-white border-green-600" },
    { label: "Recusados", valor: recusados, filtro: "recusado" as Filtro, cor: "text-red-600", corAtivo: "bg-red-600 text-white border-red-600" },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          {isGestor ? "Pedidos recebidos" : "Meus pedidos"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">Ola, {nomeUsuario}!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {cards.map(card => {
          const ativo = filtro === card.filtro;
          return (
            <button
              key={card.filtro}
              onClick={() => setFiltro(card.filtro)}
              className={`text-left w-full bg-white rounded-xl border shadow-sm p-5 transition-all cursor-pointer hover:shadow-md ${
                ativo ? card.corAtivo + " border-2" : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <p className={`text-xs uppercase tracking-wide mb-1 font-medium ${ativo ? "opacity-80" : "text-gray-400"}`}>
                {card.label}
              </p>
              <p className={`text-2xl font-bold ${ativo ? "" : card.cor}`}>
                {card.valor}
              </p>
            </button>
          );
        })}
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          {pedidos.length === 0 ? (
            <>
              <p className="text-gray-400 mb-4">Nenhum pedido encontrado.</p>
              <a href="/pedido" className="text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
                + Criar primeiro pedido
              </a>
            </>
          ) : (
            <p className="text-gray-400">
              Nenhum pedido {filtro === "todos" ? "" : filtro} no momento.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {pedidosFiltrados.map((pedido: any) => (
            <PedidoCard key={pedido.id} pedido={pedido} isGestor={isGestor} />
          ))}
        </div>
      )}
    </>
  );
}
