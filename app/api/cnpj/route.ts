import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cnpj = request.nextUrl.searchParams.get('cnpj') || '';
  const digits = cnpj.replace(/[^0-9]/g, '');

  if (digits.length !== 14) {
    return NextResponse.json({ error: 'CNPJ invalido' }, { status: 400 });
  }

  try {
    const res = await fetch('https://receitaws.com.br/v1/cnpj/' + digits, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'CNPJ nao encontrado' }, { status: res.status });
    }

    const d = await res.json();

    if (d.status === 'ERROR') {
      return NextResponse.json({ error: d.message || 'CNPJ nao encontrado' }, { status: 404 });
    }

    // Normaliza para o formato esperado pelo formulario
    return NextResponse.json({
      razao_social: d.nome || '',
      nome_fantasia: d.fantasia || '',
      logradouro: d.logradouro || '',
      numero: d.numero || '',
      complemento: d.complemento || '',
      bairro: d.bairro || '',
      municipio: d.municipio || '',
      uf: d.uf || '',
      cep: d.cep || '',
      ddd_telefone_1: d.telefone || '',
      situacao_cadastral: d.situacao || '',
    });
  } catch {
    return NextResponse.json({ error: 'Erro ao consultar CNPJ' }, { status: 500 });
  }
}
