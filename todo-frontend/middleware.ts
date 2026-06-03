import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    const path = request.nextUrl.pathname;

    const isPublicPath = ['/login', '/register'];
    if (isPublicPath && token ){
        return NextResponse.redirect(new URL('/dashboard', request.url));

    }

    const isProtectedRoute = path.startsWith('/dashboard');
    if(isProtectedRoute && !token){
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config= {
    matcher:[
        '/dashboard/:path*',
        '/login',
        '/register'
    ]

        
};