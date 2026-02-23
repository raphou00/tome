import db from "@/lib/db";
import type { Book, Books } from "./types";

export const getBooksExplore = async ({
    take = 20,
    skip = 0,
}: {
    take?: number;
    skip?: number;
} = {}): Promise<Books> => {
    const books = await db.book.findMany({
        take,
        skip,
        orderBy: {
            createdAt: "desc",
        },
        include: {
            reviews: {
                where: {
                    isApproved: true,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return books;
};

export const getBooksCarousel = async (): Promise<Books> => {
    const books = await db.book.findMany({
        orderBy: {
            popularity: "desc",
        },
        take: 5,
        include: {
            reviews: {
                where: {
                    isApproved: true,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return books;
};

export const getBestsellers = async (): Promise<Books> => {
    const books = await db.book.findMany({
        orderBy: {
            popularity: "desc",
        },
        take: 8,
        include: {
            reviews: {
                where: {
                    isApproved: true,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return books;
};

export const getBookDetails = async (bookId: string): Promise<Book | null> => {
    const book = await db.book.findUnique({
        where: {
            id: bookId,
        },
        include: {
            reviews: {
                where: {
                    isApproved: true,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    return book;
};

export const getBooksCount = async (): Promise<number> => {
    return db.book.count();
};
