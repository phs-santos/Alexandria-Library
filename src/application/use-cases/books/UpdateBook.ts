import { BookRepository } from "../../../infrastructure/repositories/BookRepository";
import { Book } from "../../../domain/entities/Book";

export class UpdateBook {
    constructor(private repo: BookRepository) {}

    async execute(id: number, data: Partial<Book>) {
        const book = await this.repo.findById(id);
        if (!book) {
            throw new Error("Livro não encontrado");
        }

        return this.repo.update(id, data);
    }
}
