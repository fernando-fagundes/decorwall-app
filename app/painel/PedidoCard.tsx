'use client'

import { useState, useTransition } from 'react'
import { atualizarStatus, excluirPedido } from './actions'

interface Item {
  nome: string
  produto_nome: string
  preco_m2: number
  largura_cm: number
  altura_cm: number
  area_liquida: number
  subtotal: number
  layout_url?: string | null
}

interface Pedido {
  id: string
  razao_social: string
  cnpj: string
  endereco: string
  cidade: string
  estado: string
  itens: Item[]
  valor_total: number
  observacoes: string
  transportadora: string
  status: string
  created_at: string
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
}
const STATUS_COLOR: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  aprovado: 'bg-green-100 text-green-800',
  recusado: 'bg-red-100 text-red-800',
}

export default function PedidoCard({ pedido, isGestor }: { pedido: Pedido; isGestor: boolean }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  function handle(action: string, fn: () => Promise<void>) {
    setLoadingAction(action)
    startTransition(async () => {
      try { await fn() } finally { setLoadingAction(null) }
    })
  }

  const cnpjFmt = pedido.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  const data = new Date(pedido.created_at).toLocaleDateString('pt-BR')

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className={"text-xs font-semibold px-2.5 py-1 rounded-full uppercase " + (STATUS_COLOR[pedido.status] || 'bg-gray-100 text-gray-600')}>
          {STATUS_LABEL[pedido.status] || pedido.status}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{pedido.razao_social || '—'}</p>
          <p className="text-xs text-gray-400">{cnpjFmt} · {data}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-bold text-gray-800">R$ {fmt(pedido.valor_total || 0)}</p>
          <p className="text-xs text-gray-400">{pedido.itens?.length || 0} parede(s)</p>
        </div>
        <button onClick={() => setOpen(o => !o)} className="ml-2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-xs">
          {open ? '▲' : '▼'}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 space-y-4">
          {(pedido.endereco || pedido.cidade) && (
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Endereço</p>
              <p className="text-sm text-gray-700">{[pedido.endereco, pedido.cidade, pedido.estado].filter(Boolean).join(', ')}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Paredes</p>
            <div className="space-y-2">
              {pedido.itens?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{item.nome}</p>
                    <p className="text-xs text-gray-500">{item.produto_nome} · {item.largura_cm}x{item.altura_cm} cm · {fmt(item.area_liquida)} m2</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 shrink-0">R$ {fmt(item.subtotal)}</p>
                  {item.layout_url && (
                    <a href={item.layout_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline shrink-0">Layout</a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {(pedido.transportadora || pedido.observacoes) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {pedido.transportadora && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Transportadora</p>
                  <p className="text-gray-700">{pedido.transportadora}</p>
                </div>
              )}
              {pedido.observacoes && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Observações</p>
                  <p className="text-gray-700">{pedido.observacoes}</p>
                </div>
              )}
            </div>
          )}

          {isGestor && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              {pedido.status === 'recusado' ? (
                /* Pedido recusado: apenas botão excluir */
                <button
                  onClick={() => {
                    if (!confirm('Excluir este pedido permanentemente?')) return
                    handle('excluir', () => excluirPedido(pedido.id))
                  }}
                  disabled={isPending}
                  className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors font-medium"
                >
                  {loadingAction === 'excluir' ? 'Excluindo...' : 'Excluir pedido'}
                </button>
              ) : (
                /* Pendente ou aprovado: aprovar, recusar, excluir */
                <>
                  {pedido.status !== 'aprovado' && (
                    <button
                      onClick={() => handle('aprovar', () => atualizarStatus(pedido.id, 'aprovado'))}
                      disabled={isPending}
                      className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                    >
                      {loadingAction === 'aprovar' ? 'Aprovando...' : 'Aprovar'}
                    </button>
                  )}
                  <button
                    onClick={() => handle('recusar', () => atualizarStatus(pedido.id, 'recusado'))}
                    disabled={isPending}
                    className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors font-medium"
                  >
                    {loadingAction === 'recusar' ? 'Recusando...' : 'Recusar'}
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm('Excluir este pedido permanentemente?')) return
                      handle('excluir', () => excluirPedido(pedido.id))
                    }}
                    disabled={isPending}
                    className="text-sm border border-red-200 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors ml-auto"
                  >
                    {loadingAction === 'excluir' ? 'Excluindo...' : 'Excluir'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
