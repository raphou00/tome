import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function getRandomPrice(): number {
    const min = 5;
    const max = 9; // because 9.99 is the highest
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomInt + 0.99;
}

async function main() {
    const books = await prisma.book.findMany({
        select: { id: true },
    });

    console.log(`Updating ${books.length} books...`);

    for (const book of books) {
        const price = getRandomPrice();

        await prisma.book.update({
            where: { id: book.id },
            data: { price },
        });
    }

    console.log("Done!");
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
