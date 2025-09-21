import { prisma } from "../../infrastructure/database/prismaClient";
import { LoanStatus } from "../../domain/enums/LoanStatus";

export class LoanService {
    /**
     * Cria um empréstimo se o livro estiver disponível
     */
    async createLoan(userId: number, bookId: number, days: number = 7) {
        // busca o livro
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            throw new Error("Livro não encontrado");
        }

        if (book.quantityAvailable <= 0) {
            throw new Error("Livro indisponível para empréstimo");
        }

        // cria empréstimo
        const loan = await prisma.loan.create({
            data: {
                userId,
                bookId,
                loanDate: new Date(),
                expectedReturnDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                status: LoanStatus.Active,
            },
        });

        // atualiza quantidade disponível
        await prisma.book.update({
            where: { id: bookId },
            data: { quantityAvailable: { decrement: 1 } },
        });

        return loan;
    }

    /**
     * Devolve um livro e atualiza o status do empréstimo
     */
    async returnLoan(loanId: number) {
        const loan = await prisma.loan.findUnique({ where: { id: loanId } });
        if (!loan) {
            throw new Error("Empréstimo não encontrado");
        }

        if (loan.returnDate) {
            throw new Error("Esse empréstimo já foi finalizado");
        }

        // devolve livro
        await prisma.loan.update({
            where: { id: loanId },
            data: {
                returnDate: new Date(),
                status: LoanStatus.Returned,
            },
        });

        // incrementa quantidade disponível do livro
        await prisma.book.update({
            where: { id: loan.bookId },
            data: { quantityAvailable: { increment: 1 } },
        });

        return { message: "Livro devolvido com sucesso" };
    }

    /**
     * Atualiza status para "Late" caso esteja atrasado
     */
    async checkOverdueLoans() {
        const today = new Date();

        const overdueLoans = await prisma.loan.findMany({
            where: {
                expectedReturnDate: { lt: today },
                status: LoanStatus.Active,
            },
        });

        for (const loan of overdueLoans) {
            await prisma.loan.update({
                where: { id: loan.id },
                data: { status: LoanStatus.Late },
            });
        }

        return overdueLoans.length;
    }
}
