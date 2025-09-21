import { PrismaClient, LoanStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedLoans() {
    const joao = await prisma.user.findUnique({
        where: { email: "joao@library.com" },
    });
    const ana = await prisma.user.findUnique({
        where: { email: "ana@library.com" },
    });
    const hobbit = await prisma.book.findUnique({
        where: { isbn: "9780007458424" },
    });
    const duna = await prisma.book.findUnique({
        where: { isbn: "9780441172719" },
    });
    const lotr = await prisma.book.findUnique({
        where: { isbn: "9780544003415" },
    });

    if (joao && ana && hobbit && duna && lotr) {
        await prisma.loan.createMany({
            data: [
                {
                    userId: joao.id,
                    bookId: hobbit.id,
                    loanDate: new Date(),
                    expectedReturnDate: new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                    ),
                    status: LoanStatus.Active,
                },
                {
                    userId: joao.id,
                    bookId: duna.id,
                    loanDate: new Date("2025-01-01"),
                    expectedReturnDate: new Date("2025-01-15"),
                    returnDate: new Date("2025-01-10"),
                    status: LoanStatus.Returned,
                },
                {
                    userId: ana.id,
                    bookId: lotr.id,
                    loanDate: new Date("2025-02-01"),
                    expectedReturnDate: new Date("2025-02-10"),
                    status: LoanStatus.Late,
                },
            ],
            skipDuplicates: true,
        });
        console.log("📖 Empréstimos de exemplo criados");
    }
}
