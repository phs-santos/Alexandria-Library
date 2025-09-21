import { BookRepository } from "../../../infrastructure/repositories/BookRepository";

export class DeleteBook {
    constructor(private repo: BookRepository) {}

    async execute(id: number) {
        const book = await this.repo.findById(id);
        if (!book) {
            throw new Error("Livro não encontrado");
        }

        await this.repo.delete(id);
        return book;
    }
}
