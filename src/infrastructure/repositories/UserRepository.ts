import { prisma } from "../database/prismaClient";
import { User } from "../../domain/entities/User";
import { UserType } from "../../domain/enums/UserType";

export class UserRepository {
    async create(user: User) {
        return prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                passwordHash: user.passwordHash,
                userType: user.userType as UserType,
                registrationDate: user.registrationDate,
            },
        });
    }

    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async findById(id: number) {
        return prisma.user.findUnique({ where: { id } });
    }

    async findAll() {
        return prisma.user.findMany();
    }

    async update(id: number, data: any) {
        // Impede alteração do libraryCard
        if ("libraryCard" in data) {
            delete data.libraryCard;
        }

        return prisma.user.update({
            where: { id },
            data,
        });
    }

    async updateLastLogin(id: number) {
        return prisma.user.update({
            where: { id },
            data: { lastLogin: new Date() },
        });
    }

    async updateStatus(id: number, status: "Active" | "Suspended" | "Pending") {
        return prisma.user.update({
            where: { id },
            data: { status },
        });
    }
}
