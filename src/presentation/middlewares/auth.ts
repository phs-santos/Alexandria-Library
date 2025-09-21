import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecret";

interface JwtPayload {
    id: number;
    email: string;
    role: string; // Admin, Librarian, Reader
    iat: number;
    exp: number;
}

// Middleware de autenticação simples
export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.fail("Token não fornecido", 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.fail("Token inválido", 401);
    }

    try {
        const decoded = jwt.verify(token, SECRET) as JwtPayload;
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.fail("Token inválido ou expirado", 403);
    }
}

// Middleware de autorização por roles
export function authorizeRoles(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user) {
            return res.fail("Usuário não autenticado", 401);
        }

        if (!roles.includes(user.role)) {
            return res.fail("Acesso negado: permissão insuficiente", 401);
        }

        next();
    };
}
