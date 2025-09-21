import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { UserStatus } from "@prisma/client";

export class UpdateUserStatus {
    constructor(private repo: UserRepository) {}

    async execute(id: number, status: UserStatus) {
        const user = await this.repo.findById(id);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return this.repo.updateStatus(id, status);
    }
}
