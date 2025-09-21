import { PrismaClient, UserType, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateLibraryCard } from "../../src/utils/generateLibraryCard";

const prisma = new PrismaClient();

export async function seedUsers() {
    // Admin
    const adminEmail = "admin@library.com";
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        await prisma.user.create({
            data: {
                name: "Admin",
                email: adminEmail,
                passwordHash: await bcrypt.hash("admin123", 10),
                userType: UserType.Admin,
                libraryCard: generateLibraryCard(),
                status: UserStatus.Active,
                membershipDate: new Date(),
            },
        });
        console.log("✅ Usuário Admin criado: admin@library.com / admin123");
    }

    // Outros usuários
    const users = [
        {
            name: "Maria Bibliotecária",
            email: "maria@library.com",
            passwordHash: await bcrypt.hash("lib123", 10),
            userType: UserType.Librarian,
            phone: "5511999991111",
            libraryCard: generateLibraryCard(),
            status: UserStatus.Active,
            membershipDate: new Date(),
        },
        {
            name: "João Leitor",
            email: "joao@library.com",
            passwordHash: await bcrypt.hash("reader123", 10),
            userType: UserType.Reader,
            phone: "5511988882222",
            libraryCard: generateLibraryCard(),
            status: UserStatus.Active,
            membershipDate: new Date(),
        },
        {
            name: "Ana Leitor",
            email: "ana@library.com",
            passwordHash: await bcrypt.hash("reader123", 10),
            userType: UserType.Reader,
            phone: "5511977773333",
            libraryCard: generateLibraryCard(),
            status: UserStatus.Suspended,
            membershipDate: new Date("2024-12-01"),
            lastLogin: new Date("2025-02-01"),
        },
    ];

    await prisma.user.createMany({ data: users, skipDuplicates: true });
    console.log("👤 Usuários de exemplo criados");
}
