'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function atualizarStatus(pedidoId: string, status: 'aprovado' | 'recusado') {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pedidos')
    .update({ status })
    .eq('id', pedidoId)
  if (error) throw new Error(error.message)
  revalidatePath('/painel')
}

export async function excluirPedido(pedidoId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', pedidoId)
  if (error) throw new Error(error.message)
  revalidatePath('/painel')
}
