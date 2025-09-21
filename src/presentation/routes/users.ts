import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.post(
    "/users",
    authMiddleware,
    authorizeRoles("Admin"),
    UserController.create
);

router.get(
    "/users",
    authMiddleware,
    authorizeRoles("Admin"),
    UserController.list
);

router.get("/users/profile", authMiddleware, UserController.profile);

router.patch(
    "/users/:id/status",
    authMiddleware,
    authorizeRoles("Admin"),
    UserController.updateStatus
);

export default router;
