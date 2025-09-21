import { BookRepository } from "../../../infrastructure/repositories/BookRepository";

export class ListOneBook {
    constructor(private repo: BookRepository) {}

    async execute(id: number) {
        return this.repo.findById(id);
    }
}
