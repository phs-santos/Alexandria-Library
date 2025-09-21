import { prisma } from "../database/prismaClient";
import { Prisma } from "@prisma/client";

export class AuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    }

    async createUser(data: Prisma.UserCreateInput) {
        return prisma.user.create({ data });
    }

    async updateLastLogin(id: number) {
        return prisma.user.update({
            where: { id },
            data: { lastLogin: new Date() },
        });
    }
}
