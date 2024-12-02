import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {

    const path = request.nextUrl.pathname;
    const token = request.cookies.get('token')?.value || '';
    const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET || 'Secret_Key');

    let isAuthenticated = false;
    let userRole = '';

    // Verify and decode the token if it exists
    if (token) {
        try {
            const decoded = await jwtVerify(token, TOKEN_SECRET);  // Decode the JWT token
            isAuthenticated = true;
            userRole = decoded.payload.userrole; 
        } catch (error) {
            console.error("Token verification failed:", error);
        }
    }
    console.log("user role is undefined : ",userRole);
    
console.log(userRole);

    // Define the public paths where authentication is not required
    const publicPaths = ['/login', '/signup'];

    // If the user is authenticated and tries to access public paths, redirect them to the home page
    if (publicPaths.includes(path) && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Define the protected paths where authentication is required
    const protectedPaths = ['/', '/profile', '/components/Attentance'];

    // If the user is not authenticated and tries to access protected paths, redirect to login
    if (protectedPaths.includes(path) && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based access control logic:
    // Only 'hr' role can access '/' (home) and '/components/HRApprovel'
    const allowedPathsForHR = ['/', '/components/HRApprovel'];
    if (allowedPathsForHR.includes(path) && userRole !== 'hr'&& userRole !== 'manager') {
        // If the user is not HR, redirect them to the home page or any other page
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow the request to proceed if authenticated and authorized
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/', // Home page, HR only
        '/components/Attentance', // Protected path
        '/profile', // Protected path
        '/login', // Login page
        '/signup', // Signup page
        '/components/HRApprovel', // HR Approval page, HR only
    ],
};
