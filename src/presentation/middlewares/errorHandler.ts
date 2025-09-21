import { Request, Response, NextFunction } from "express";

export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    console.error("🔥 Erro capturado pelo middleware:", err);

    return res.status(500).json({
        error: true,
        message: err.message || "Erro interno do servidor",
        data: null,
    });
}
