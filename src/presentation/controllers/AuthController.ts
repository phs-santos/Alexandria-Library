import { Request, Response } from "express";
import { AuthRepository } from "../../infrastructure/repositories/AuthRepository";
import { RegisterUser } from "../../application/use-cases/auth/RegisterUser";
import { LoginUser } from "../../application/use-cases/auth/LoginUser";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { name, email, password, userType } = req.body;

            const repo = new AuthRepository();
            const useCase = new RegisterUser(repo);

            const user = await useCase.execute(name, email, password, userType);

            return res.status(201).json({
                error: false,
                message: "Usuário registrado com sucesso",
                data: user,
            });
        } catch (err: any) {
            return res.status(400).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const repo = new AuthRepository();
            const useCase = new LoginUser(repo);

            const result = await useCase.execute(email, password);

            return res.json({
                error: false,
                message: "Login realizado com sucesso",
                data: result,
            });
        } catch (err: any) {
            return res.status(401).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }
}
