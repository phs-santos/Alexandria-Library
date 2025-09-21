import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../../../infrastructure/repositories/AuthRepository";

const SECRET = process.env.JWT_SECRET || "supersecret";

export class LoginUser {
    constructor(private repo: AuthRepository) {}

    async execute(email: string, password: string) {
        const user = await this.repo.findByEmail(email);
        if (!user) {
            throw new Error("Credenciais inválidas");
        }

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            throw new Error("Credenciais inválidas");
        }

        // Payload enriquecido com mais informações
        const payload = {
            id: user.id,
            email: user.email,
            role: user.userType,
            name: user.name,
            libraryCard: user.libraryCard,
            status: user.status,
        };

        const token = jwt.sign(payload, SECRET, {
            expiresIn: "24h", // mantém 24h
            issuer: "alexandria-library", // quem emitiu
            subject: user.id.toString(), // identifica o dono do token
        });

        const { passwordHash, ...safeUser } = user;

        return {
            token,
            user: safeUser,
        };
    }
}
