import { Request, Response, NextFunction } from "express";

export function responseHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.success = (data: any, message = "ok") => {
        return res.json({
            error: false,
            message,
            data,
        });
    };

    res.fail = (
        message = "Erro inesperado",
        status = 400,
        data: any = null
    ) => {
        return res.status(status).json({
            error: true,
            message,
            data,
        });
    };

    next();
}

// Adiciona tipos customizados ao Express
declare global {
    namespace Express {
        interface Response {
            success: (data: any, message?: string) => Response;
            fail: (message?: string, status?: number, data?: any) => Response;
        }
    }
}
