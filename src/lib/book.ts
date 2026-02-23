import db from "@/lib/db";
import type { Book, Books } from "./types";

type SortOption =
    | "newest"
    | "oldest"
    | "price-low-high"
    | "price-high-low"
    | "popularity";

const getSortOrder = (sort: SortOption) => {
    switch (sort) {
        case "oldest":
            return { createdAt: "asc" as const };
        case "price-low-high":
            return { price: "asc" as const };
        case "price-high-low":
            return { price: "desc" as const };
        case "popularity":
            return { popularity: "desc" as const };
        case "newest":
        default:
            return { createdAt: "desc" as const };
    }
};

export const getBooksExplore = async ({
    take = 20,
    skip = 0,
    search = "",
    sort = "newest",
}: {
    take?: number;
    skip?: number;
    search?: string;
    sort?: SortOption;
} = {}): Promise<Books> => {
    const where =
        search ?
            {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    { authors: { hasSome: [search] } },
                    { summaries: { hasSome: [search] } },
                    { subjects: { hasSome: [search] } },
                ],
            }
        :   undefined;

    const books = await db.book.findMany({
        take,
        skip,
        where,
        orderBy: getSortOrder(sort),
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

export const getBooksCount = async (search = ""): Promise<number> => {
    const where =
        search ?
            {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    { authors: { hasSome: [search] } },
                    { summaries: { hasSome: [search] } },
                    { subjects: { hasSome: [search] } },
                ],
            }
        :   undefined;

    return db.book.count({
        where,
    });
};

export const getBooksCarousel = async (): Promise<Books> => {
    const books = await db.book.findMany({
        orderBy: {
            popularity: "desc",
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
        take: 5,
    });

    return books;
};

export const getBestsellers = async (): Promise<Books> => {
    const books = await db.book.findMany({
        orderBy: {
            popularity: "desc",
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
        take: 8,
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
