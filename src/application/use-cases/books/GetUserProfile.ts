import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

export class GetUserProfile {
    constructor(private repo: UserRepository) {}

    async execute(id: number) {
        const user = await this.repo.findById(id);
        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        // remove o hash antes de devolver
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    }
}
