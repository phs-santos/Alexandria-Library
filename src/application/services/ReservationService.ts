import { prisma } from "../../infrastructure/database/prismaClient";
import { ReservationStatus } from "../../domain/enums/ReservationStatus";

export class ReservationService {
    /**
     * Cria uma reserva se o livro não tiver exemplares disponíveis
     */
    async createReservation(userId: number, bookId: number) {
        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) throw new Error("Livro não encontrado");

        if (book.quantityAvailable > 0) {
            throw new Error("Só é possível reservar livros indisponíveis");
        }

        const reservation = await prisma.reservation.create({
            data: {
                userId,
                bookId,
                reservationDate: new Date(),
                status: ReservationStatus.Active,
            },
        });

        return reservation;
    }

    /**
     * Cancela uma reserva ativa
     */
    async cancelReservation(reservationId: number) {
        const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
        if (!reservation) throw new Error("Reserva não encontrada");

        if (reservation.status !== ReservationStatus.Active) {
            throw new Error("Apenas reservas ativas podem ser canceladas");
        }

        return prisma.reservation.update({
            where: { id: reservationId },
            data: { status: ReservationStatus.Canceled },
        });
    }

    /**
     * Quando um livro é devolvido, atende a reserva mais antiga
     */
    async attendNextReservation(bookId: number) {
        const reservation = await prisma.reservation.findFirst({
            where: { bookId, status: ReservationStatus.Active },
            orderBy: { reservationDate: "asc" },
        });

        if (!reservation) {
            return null; // não há reserva para atender
        }

        await prisma.reservation.update({
            where: { id: reservation.id },
            data: { status: ReservationStatus.Attended },
        });

        return reservation;
    }
}
