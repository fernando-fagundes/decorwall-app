import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cnpj = request.nextUrl.searchParams.get('cnpj') || '';
  const digits = cnpj.replace(/[^0-9]/g, '');

  if (digits.length !== 14) {
    return NextResponse.json({ error: 'CNPJ invalido' }, { status: 400 });
  }

  try {
    const res = await fetch('https://brasilapi.com.br/api/cnpj/v1/' + digits, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'CNPJ nao encontrado' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Erro ao consultar CNPJ' }, { status: 500 });
  }
}
