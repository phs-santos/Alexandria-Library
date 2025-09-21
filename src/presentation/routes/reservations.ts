import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController";

const router = Router();

router.post("/reservations", ReservationController.create);
router.post("/reservations/:id/cancel", ReservationController.cancel);

export default router;
