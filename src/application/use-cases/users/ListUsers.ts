import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

export class ListUsers {
    constructor(private repo: UserRepository) { }

    async execute() {
        return this.repo.findAll();
    }
}
