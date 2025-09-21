import { Router } from "express";
import { LoanController } from "../controllers/LoanController";

const router = Router();

// criar empréstimo
router.post("/loans", LoanController.create);

// devolver livro
router.post("/loans/:id/return", LoanController.return);

// checar atrasados
router.patch("/loans/check-overdue", LoanController.checkOverdue);

export default router;
