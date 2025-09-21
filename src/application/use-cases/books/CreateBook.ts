import { Book } from "../../../domain/entities/Book";
import { BookRepository } from "../../../infrastructure/repositories/BookRepository";

export class CreateBook {
    constructor(private repo: BookRepository) { }

    async execute(data: {
        title: string;
        author: string;
        isbn: string;
        category: string;
        publisher: string;
        publicationYear: number;
        totalQuantity: number;
        coverUrl: string;
    }) {
        const book = new Book(
            data.title,
            data.author,
            data.isbn,
            data.category,
            data.publisher,
            data.publicationYear,
            data.totalQuantity,
            data.totalQuantity, // disponível inicialmente
            data.coverUrl
        );

        return this.repo.create(book);
    }
}
