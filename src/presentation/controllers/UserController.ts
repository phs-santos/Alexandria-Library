import { Request, Response } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { CreateUser } from "../../application/use-cases/users/CreateUser";
import { UserType } from "../../domain/enums/UserType";
import { ListUsers } from "../../application/use-cases/users/ListUsers";
import { GetUserProfile } from "../../application/use-cases/books/GetUserProfile";
import { UpdateUserStatus } from "../../application/use-cases/users/UpdateUserStatus";

export class UserController {
    static async create(req: Request, res: Response) {
        try {
            const repo = new UserRepository();
            const useCase = new CreateUser(repo);
            const user = await useCase.execute({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                userType: req.body.userType as UserType,
            });
            res.status(201).json(user);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async list(_req: Request, res: Response) {
        const repo = new UserRepository();
        const useCase = new ListUsers(repo);
        const users = await useCase.execute();
        res.json(users);
    }

    static async profile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id; // vem do authMiddleware
            const repo = new UserRepository();
            const useCase = new GetUserProfile(repo);

            const user = await useCase.execute(userId);

            return res.json({
                error: false,
                message: "Perfil carregado com sucesso",
                data: user,
            });
        } catch (err: any) {
            return res.status(404).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;

            const repo = new UserRepository();
            const useCase = new UpdateUserStatus(repo);

            const user = await useCase.execute(id, status);

            return res.json({
                error: false,
                message: "Status atualizado com sucesso",
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
}
