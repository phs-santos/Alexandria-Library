import { prisma } from "../database/prismaClient";
import { Book } from "../../domain/entities/Book";

export class BookRepository {
    async create(book: Book) {
        return prisma.book.create({
            data: {
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                category: book.category,
                publisher: book.publisher,
                publicationYear: book.publicationYear,
                totalQuantity: book.totalQuantity,
                quantityAvailable: book.quantityAvailable,
                coverUrl: book.coverUrl,
            },
        });
    }

    async findAll() {
        return prisma.book.findMany();
    }

    async findById(id: number) {
        return prisma.book.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: Partial<Book>) {
        return prisma.book.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return prisma.book.delete({ where: { id } });
    }
}
