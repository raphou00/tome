import axios from "axios";
import pLimit from "p-limit";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BASE_URL = "http://localhost:8000/books";
const CONCURRENCY = 5;
const BATCH_SIZE = 200;

type GutendexAuthor = {
    name: string;
};

type GutendexBook = {
    id: number;
    title: string;
    authors: GutendexAuthor[];
    summaries?: string[];
    subjects: string[];
    languages: string[];
    download_count: number;
    formats: Record<string, string>;
};

const limit = pLimit(CONCURRENCY);

function mapBook(book: GutendexBook) {
    const cover = book.formats["image/jpeg"] ?? null;

    const epub =
        book.formats["application/epub+zip"] ??
        book.formats["application/epub+zip; charset=utf-8"] ??
        null;

    if (!epub) return null;

    return {
        gutenbergId: book.id,
        title: book.title,
        cover,
        file: epub,
        authors: book.authors.map((a) => a.name),
        summaries: book.summaries ?? [],
        subjects: book.subjects ?? [],
        popularity: book.download_count ?? 0,
        languages: book.languages ?? [],
        price: 0,
    };
}

async function flush(buffer: any[]) {
    const batch = buffer.splice(0, buffer.length);

    console.log(`📦 Inserting batch of ${batch.length}`);

    await prisma.book.createMany({
        data: batch,
        skipDuplicates: true,
    });
}

async function seedBooks() {
    let url: string | null = BASE_URL;
    const buffer: any[] = [];

    type GutendexResponse = {
        results: GutendexBook[];
        next: string | null;
    };

    while (url) {
        console.log("⬇️ Fetching:", url);

        const response: GutendexResponse = (
            await axios.get(url, { timeout: 30000 })
        ).data;

        const tasks = response.results.map((book: GutendexBook) =>
            limit(async () => mapBook(book))
        );

        const mapped = (await Promise.all(tasks)).filter(Boolean);
        buffer.push(...mapped);

        if (buffer.length >= BATCH_SIZE) {
            await flush(buffer);
        }

        url = response.next;
    }

    if (buffer.length) {
        await flush(buffer);
    }
}

async function main() {
    console.log("🌱 Seeding database...");

    await seedBooks();

    console.log("✅ Done.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
