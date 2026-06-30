import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cnpj = request.nextUrl.searchParams.get('cnpj') || '';
  const digits = cnpj.replace(/[^0-9]/g, '');

  if (digits.length !== 14) {
    return NextResponse.json({ error: 'CNPJ invalido' }, { status: 400 });
  }

  try {
    const res = await fetch('https://publica.cnpj.ws/cnpj/' + digits, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'CNPJ nao encontrado' }, { status: res.status });
    }

    const d = await res.json();
    const est = d.estabelecimento || {};

    // Normaliza para o formato esperado pelo formulario
    const telefone = est.ddd1 && est.telefone1 ? est.ddd1 + est.telefone1 : '';

    return NextResponse.json({
      razao_social: d.razao_social || '',
      nome_fantasia: est.nome_fantasia || '',
      logradouro: [est.tipo_logradouro, est.logradouro].filter(Boolean).join(' '),
      numero: est.numero || '',
      complemento: est.complemento || '',
      bairro: est.bairro || '',
      municipio: est.cidade?.nome || '',
      uf: est.estado?.sigla || '',
      cep: est.cep || '',
      ddd_telefone_1: telefone,
      situacao_cadastral: est.situacao_cadastral || '',
    });
  } catch {
    return NextResponse.json({ error: 'Erro ao consultar CNPJ' }, { status: 500 });
  }
}
