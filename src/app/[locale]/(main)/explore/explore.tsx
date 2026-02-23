"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Books } from "@/lib/types";
import { NoBooksResults } from "@/components/ui/no-results";
import Title from "@/components/ui/title";
import Book from "@/components/ui/book";

type SortOption =
    | "newest"
    | "oldest"
    | "price-low-high"
    | "price-high-low"
    | "popularity";

type ExploreProps = {
    books: Books;
    totalBooks: number;
    currentPage: number;
    perPage: number;
};

const Explore: React.FC<ExploreProps> = ({
    books,
    totalBooks,
    currentPage,
    perPage,
}) => {
    const t = useTranslations("pages.explore");
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [sortBy, setSortBy] = useState<SortOption>(
        (searchParams.get("sort") as SortOption) || "newest"
    );

    const totalPages = Math.ceil(totalBooks / perPage);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (searchQuery) {
            params.set("q", searchQuery);
        } else {
            params.delete("q");
        }
        params.set("sort", sortBy);
        params.set("page", String(currentPage));
        replace(`${pathname}?${params.toString()}`);
    }, [searchQuery, sortBy, currentPage, pathname, replace, searchParams]);

    const filteredBooks = useMemo(() => {
        const filtered = books.filter((book) => {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                !query ||
                book.title.toLowerCase().includes(query) ||
                book.authors?.some((author) =>
                    author.toLowerCase().includes(query)
                ) ||
                book.subjects?.some((subject) =>
                    subject.toLowerCase().includes(query)
                );

            return matchesSearch;
        });

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    );
                case "price-low-high":
                    return a.price - b.price;
                case "price-high-low":
                    return b.price - a.price;
                case "popularity":
                    return b.popularity - a.popularity;
                case "newest":
                default:
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
            }
        });

        return filtered;
    }, [books, searchQuery, sortBy]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(page));
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="flex items-end gap-x-4">
                <Title text={t("title")} className="text-3xl lg:text-4xl" />
                <p className="text-neutral/80">
                    {t("books-found", { count: filteredBooks.length })}
                </p>
            </div>

            <div className="my-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 size-5 z-50" />
                        <input
                            type="search"
                            placeholder={t("search")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input w-full px-3 pl-9 border-2 bg-base-100 tracking-wide transition placeholder:text-neutral-400 focus:border-primary/80 focus:outline-none focus:bg-base-300"
                            spellCheck={false}
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                        />
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as SortOption)
                        }
                        className="select w-min appearance-none border-2 outline-none focus-within:border-primary/80 focus:bg-base-300"
                    >
                        <option value="newest">{t("newest")}</option>
                        <option value="oldest">{t("oldest")}</option>
                        <option value="price-low-high">
                            {t("price-low-high")}
                        </option>
                        <option value="price-high-low">
                            {t("price-high-low")}
                        </option>
                        <option value="popularity">{t("popularity")}</option>
                    </select>
                </div>
            </div>

            {filteredBooks.length === 0 ?
                <NoBooksResults />
            :   <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14">
                        {filteredBooks.map((book) => (
                            <Book key={book.id} book={book} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-12">
                            <div className="join">
                                <button
                                    className="join-item btn"
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage <= 1}
                                >
                                    «
                                </button>
                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1
                                )
                                    .filter((page) => {
                                        return (
                                            page === 1 ||
                                            page === totalPages ||
                                            Math.abs(page - currentPage) <= 1
                                        );
                                    })
                                    .map((page, idx, arr) => (
                                        <>
                                            {idx > 0 &&
                                                arr[idx - 1] !== page - 1 && (
                                                    <button
                                                        key={`ellipsis-${page}`}
                                                        className="join-item btn btn-disabled"
                                                    >
                                                        ...
                                                    </button>
                                                )}
                                            <button
                                                key={page}
                                                className={`join-item btn ${
                                                    page === currentPage ?
                                                        "btn-active"
                                                    :   ""
                                                }`}
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                            >
                                                {page}
                                            </button>
                                        </>
                                    ))}
                                <button
                                    className="join-item btn"
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage >= totalPages}
                                >
                                    »
                                </button>
                            </div>
                        </div>
                    )}
                </>
            }
        </>
    );
};

export default Explore;
