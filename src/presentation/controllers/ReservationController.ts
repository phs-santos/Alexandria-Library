import { Request, Response } from "express";
import { ReservationService } from "../../application/services/ReservationService";

export class ReservationController {
    static async create(req: Request, res: Response) {
        try {
            const { userId, bookId } = req.body;
            const service = new ReservationService();
            const reservation = await service.createReservation(userId, bookId);
            res.status(201).json(reservation);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async cancel(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const service = new ReservationService();
            const result = await service.cancelReservation(Number(id));
            res.json(result);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
