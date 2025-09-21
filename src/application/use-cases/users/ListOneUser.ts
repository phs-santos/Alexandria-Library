import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

export class ListOneUser {
    constructor(private repo: UserRepository) {}

    async execute(email: string) {
        return this.repo.findByEmail(email);
    }
}
