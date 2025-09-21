import { PrismaClient, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedReservations() {
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
        await prisma.reservation.createMany({
            data: [
                {
                    userId: ana.id,
                    bookId: hobbit.id,
                    reservationDate: new Date(),
                    status: ReservationStatus.Active,
                },
                {
                    userId: joao.id,
                    bookId: lotr.id,
                    reservationDate: new Date("2025-01-20"),
                    status: ReservationStatus.Canceled,
                },
                {
                    userId: ana.id,
                    bookId: duna.id,
                    reservationDate: new Date("2025-01-25"),
                    status: ReservationStatus.Attended,
                },
            ],
            skipDuplicates: true,
        });
        console.log("📌 Reservas de exemplo criadas");
    }
}
