import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Redirect logged-in users away from login/cadastro
  if ((pathname === '/login' || pathname === '/cadastro') && user) {
    return NextResponse.redirect(new URL('/painel', request.url))
  }

  // Protect /painel routes
  if (pathname.startsWith('/painel')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check approval (skip on the waiting page itself)
    if (!pathname.startsWith('/aguardando-aprovacao')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('aprovado')
        .eq('id', user.id)
        .single()

      if (!profile?.aprovado) {
        return NextResponse.redirect(new URL('/aguardando-aprovacao', request.url))
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/painel/:path*', '/login', '/cadastro'],
}
