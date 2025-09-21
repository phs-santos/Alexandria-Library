import bcrypt from "bcryptjs";
import { AuthRepository } from "../../../infrastructure/repositories/AuthRepository";
import { UserType, UserStatus } from "@prisma/client";
import { generateLibraryCard } from "../../../utils/generateLibraryCard";

export class RegisterUser {
    constructor(private repo: AuthRepository) {}

    async execute(
        name: string,
        email: string,
        password: string,
        userType: UserType,
        phone?: string
    ) {
        const existing = await this.repo.findByEmail(email);
        if (existing) {
            throw new Error("E-mail já registrado");
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await this.repo.createUser({
            name,
            email,
            passwordHash: hash,
            userType,
            phone,
            libraryCard: generateLibraryCard(), // 👈 gerado automaticamente
            status: UserStatus.Pending,
            membershipDate: new Date(),
        });

        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
}
