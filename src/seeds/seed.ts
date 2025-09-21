import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seedUsers";
import { seedBooks } from "./seedBooks";
import { seedLoans } from "./seedLoans";
import { seedReservations } from "./seedReservations";

const prisma = new PrismaClient();

async function main() {
    await seedUsers();
    await seedBooks();
    await seedLoans();
    await seedReservations();
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (err) => {
        console.error("❌ Erro ao executar seed:", err);
        await prisma.$disconnect();
        process.exit(1);
    });
