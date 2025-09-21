import { BookRepository } from "../../../infrastructure/repositories/BookRepository";

export class ListBooks {
    constructor(private repo: BookRepository) { }

    async execute() {
        return this.repo.findAll();
    }
}
