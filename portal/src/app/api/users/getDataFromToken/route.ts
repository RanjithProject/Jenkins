import jwt from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET || 'Secret_Key'; // Use environment variable

export async function getDataFromToken(request) {
    const token = request.cookies.get('token')?.value;
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, TOKEN_SECRET);
    return decoded.id; // Return user ID from token
}
