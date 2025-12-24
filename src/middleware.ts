import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';

// Create next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Initialize Supabase Response
    // We need to create a response object first to pass to Supabase
    // However, we can't fully create it because we might need to redirect based on auth
    // OR we might need to let next-intl handle other things.
    //
    // Strategy:
    // a. Run Auth logic. If redirect needed, return redirect.
    // b. If Auth passes, run intlMiddleware.
    // c. Ensure Supabase cookies are managed.

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    // This modifies the request and response
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 2. Check Auth Status
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // Define protected routes pattern
    // Check if path starts with /[locale]/dashboard/admin or /dashboard/admin
    // We need to be careful with locales. 
    // path could be /es/dashboard/admin... or /en/dashboard/admin...

    const isProtected =
        path.includes('/dashboard/admin'); // Simple check, covers /es/... and /...

    if (isProtected && !user) {
        // Redirect to login
        // We try to respect the locale if present, otherwise default to /es
        const locale = path.split('/')[1] || 'es';
        // If the split[1] is not a valid locale (e.g. 'dashboard'), default to 'es'
        const validLocale = ['en', 'es'].includes(locale) ? locale : 'es';

        return NextResponse.redirect(new URL(`/${validLocale}/dashboard/login`, request.url));
    }

    // 3. Delegate to next-intl
    // If we are authenticated or not visiting a protected route, let next-intl handle routing
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
