<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('origin');
        $allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://todo-web-app-next-js-laravel-postgre-sql-esh7-zm168t31n.vercel.app',
        ];

        $headers = [
            'Access-Control-Allow-Origin' => in_array($origin, $allowedOrigins, true) ? $origin : 'https://todo-web-app-next-js-laravel-postgre-sql-esh7-zm168t31n.vercel.app',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN, X-XSRF-TOKEN',
        ];

        if ($request->getMethod() === 'OPTIONS') {
            return new Response('', 204, $headers);
        }

        $response = $next($request);

        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}
