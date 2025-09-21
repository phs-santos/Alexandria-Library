import { Request, Response } from "express";
import { LoanService } from "../../application/services/LoanService";

export class LoanController {
    static async create(req: Request, res: Response) {
        try {
            const { userId, bookId, days } = req.body;
            const service = new LoanService();
            const loan = await service.createLoan(userId, bookId, days);
            res.status(201).json(loan);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async return(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const service = new LoanService();
            const result = await service.returnLoan(Number(id));
            res.json(result);
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    static async checkOverdue(_req: Request, res: Response) {
        try {
            const service = new LoanService();
            const count = await service.checkOverdueLoans();
            res.json({ message: `${count} empréstimos marcados como atrasados` });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }
}
