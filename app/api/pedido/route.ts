import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usa chave anon — RLS permite INSERT anonimo em pedidos e clientes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      cnpjDigits, razaoSocial, endereco, cidade, estado, telefone,
      itens, valorTotal, transportadora, observacoes, userId,
    } = body;

    const { data: clienteData, error: clienteError } = await supabase
      .from("clientes")
      .upsert(
        { cnpj: cnpjDigits, razao_social: razaoSocial, endereco, cidade, estado, telefone },
        { onConflict: "cnpj" }
      )
      .select("id")
      .single();

    if (clienteError) {
      return NextResponse.json({ error: "Erro ao registrar cliente: " + clienteError.message }, { status: 400 });
    }

    const { data: pedidoData, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        user_id: userId || null,
        cliente_id: clienteData.id,
        cnpj: cnpjDigits,
        razao_social: razaoSocial,
        endereco, cidade, estado,
        itens,
        valor_total: valorTotal,
        transportadora,
        observacoes,
      })
      .select("numero")
      .single();

    if (pedidoError) {
      return NextResponse.json({ error: "Erro ao enviar pedido: " + pedidoError.message }, { status: 400 });
    }

    return NextResponse.json({ numero: pedidoData.numero });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
