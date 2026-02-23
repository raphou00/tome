import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3"; // change if needed

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRating() {
    const rand = Math.random();
    if (rand < 0.05) return 1;
    if (rand < 0.1) return 2;
    if (rand < 0.3) return 3;
    if (rand < 0.7) return 4;
    return 5;
}

async function generateReview(bookTitle: string, rating: number) {
    const prompt = `
Write a short and realistic user review for a book.

Book: ${bookTitle}
Rating: ${rating}/5

Rules:
- 2 to 4 sentences
- Natural tone
- No emojis
- No markdown
`;

    const res = await fetch(OLLAMA_URL, {
        method: "POST",
        body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
        }),
    });

    const data = await res.json();
    return data.response.trim();
}

async function main() {
    const books = await prisma.book.findMany({
        orderBy: { popularity: "desc" },
        take: 10,
    });

    for (const book of books) {
        const reviewCount = randomInt(40, 50);

        console.log(`Generating ${reviewCount} reviews for "${book.title}"`);

        for (let i = 0; i < reviewCount; i++) {
            const rating = randomRating();

            const content = await generateReview(book.title, rating);

            // create fake user
            const user = await prisma.user.create({
                data: {
                    email: `fake_${book.id}_${i}@example.com`,
                    name: `Reader ${randomInt(1000, 9999)}`,
                    password: "fake", // adapt to your schema
                },
            });

            await prisma.review.create({
                data: {
                    userId: user.id,
                    bookId: book.id,
                    rating,
                    content,
                    isApproved: true,
                },
            });
        }
    }

    console.log("Done!");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
