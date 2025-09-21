const { Router } = require("express");
import healthRoutes from "./health";
import authRoutes from "./auth";
import bookRoutes from "./books";
import userRoutes from "./users";
import loanRoutes from "./loans";
import reservationRoutes from "./reservations";

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(bookRoutes);
router.use(userRoutes);
router.use(loanRoutes);
router.use(reservationRoutes);

export default router;
