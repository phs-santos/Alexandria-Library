import { Request, Response } from "express";
import { BookRepository } from "../../infrastructure/repositories/BookRepository";
import { CreateBook } from "../../application/use-cases/books/CreateBook";
import { ListBooks } from "../../application/use-cases/books/ListBooks";
import { ListOneBook } from "../../application/use-cases/books/ListOneBook";
import { UpdateBook } from "../../application/use-cases/books/UpdateBook";
import { DeleteBook } from "../../application/use-cases/books/DeleteBook";

export class BookController {
    static async create(req: Request, res: Response) {
        try {
            const repo = new BookRepository();
            const useCase = new CreateBook(repo);
            const book = await useCase.execute(req.body);

            res.status(201).json({
                error: false,
                message: "Livro criado com sucesso",
                data: book,
            });
        } catch (err: any) {
            res.status(400).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }

    static async list(_req: Request, res: Response) {
        try {
            const repo = new BookRepository();
            const useCase = new ListBooks(repo);
            const books = await useCase.execute();

            res.json({
                error: false,
                message: "Lista de livros carregada",
                data: books,
            });
        } catch (err: any) {
            res.status(500).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const repo = new BookRepository();
            const useCase = new ListOneBook(repo);

            const book = await useCase.execute(id);

            if (!book) {
                return res.status(404).json({
                    error: true,
                    message: "Livro não encontrado",
                    data: null,
                });
            }

            res.json({
                error: false,
                message: "Livro encontrado",
                data: book,
            });
        } catch (err: any) {
            res.status(400).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const repo = new BookRepository();
            const useCase = new UpdateBook(repo);

            const book = await useCase.execute(id, req.body);

            res.json({
                error: false,
                message: "Livro atualizado com sucesso",
                data: book,
            });
        } catch (err: any) {
            res.status(400).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const repo = new BookRepository();
            const useCase = new DeleteBook(repo);

            await useCase.execute(id);

            return res.json({
                error: false,
                message: "Livro deletado com sucesso",
                data: null,
            });
        } catch (err: any) {
            if (err.message === "Livro não encontrado") {
                return res.status(404).json({
                    error: true,
                    message: err.message,
                    data: null,
                });
            }
            return res.status(400).json({
                error: true,
                message: err.message,
                data: null,
            });
        }
    }
}
