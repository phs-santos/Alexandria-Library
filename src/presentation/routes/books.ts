import { Router } from "express";
import { BookController } from "../controllers/BookController";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";

const router = Router();

router.post(
    "/books",
    authMiddleware,
    authorizeRoles("Admin"),
    BookController.create
);

router.get(
    "/books",
    authMiddleware,
    authorizeRoles("Reader", "Librarian", "Admin"),
    BookController.list
);

router.patch(
    "/books/:id",
    authMiddleware,
    authorizeRoles("Librarian", "Admin"),
    BookController.update
);

router.delete(
    "/books/:id",
    authMiddleware,
    authorizeRoles("Admin"),
    BookController.delete
);

router.get(
    "/books/:id",
    authMiddleware,
    authorizeRoles("Reader", "Librarian", "Admin"),
    BookController.getById
);

export default router;
