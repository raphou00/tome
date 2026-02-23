"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";
import { formatAmountForDisplay } from "@/lib/utils";
import type { Book, Books } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import Title from "@/components/ui/title";
import Rating from "@/components/ui/rating";
import BookCard from "@/components/ui/book";
import Avatar from "@/components/ui/avatar";

type BookProps = {
    book: Book;
    recommendation: Books;
};

const BookDetails: React.FC<BookProps> = ({ book, recommendation }) => {
    const t = useTranslations("pages.book");
    const tCommon = useTranslations("common");
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(book.id, book.title, book.cover, book.price);
        toast.success(`${book.title} added to cart!`);
    };

    const authors =
        book.authors?.join(", ") ||
        tCommon("unknown-author", { defaultValue: "Unknown Author" });

    return (
        <div className="space-y-2">
            <nav className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <Link href="/" className="hover:text-primary">
                            {t("home")}
                        </Link>
                    </li>
                    <li>
                        {" "}
                        <Link href="/explore" className="hover:text-primary">
                            {t("books")}
                        </Link>
                    </li>
                    <li>{book.title}</li>
                </ul>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex justify-center">
                    <div className="relative overflow-hidden rounded-field h-[500px] aspect-9/12">
                        <Image
                            src={book.cover}
                            alt={book.title}
                            fill
                            className="rounded-field object-contain transition hover:scale-105"
                        />
                    </div>
                </div>

                <div className="space-y-6 flex flex-col justify-between">
                    <div>
                        <Title
                            className="text-3xl lg:text-4xl font-bold mb-2"
                            text={formatAmountForDisplay(book.price)}
                        />
                        <Title
                            className="text-2xl lg:text-3xl font-bold mb-2"
                            text={book.title}
                        />

                        <p className="text-base-content/70 mb-4">{authors}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {book.subjects?.slice(0, 5).map((subject) => (
                                <span
                                    key={subject}
                                    className="badge badge-primary bg-primary/80 badge-sm"
                                >
                                    {subject}
                                </span>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-base-300">
                            <div>
                                <div className="text-sm text-base-content/60">
                                    {t("language")}
                                </div>
                                <div className="font-medium">
                                    {book.languages?.[0] || "English"}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-base-content/60">
                                    {t("subjects")}
                                </div>
                                <div className="font-medium">
                                    {book.subjects?.length || 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm text-neutral/50 text-left">
                            eBook - Instant download after purchase
                        </p>
                        <button
                            onClick={handleAddToCart}
                            className="btn btn-primary btn-lg w-full gap-2"
                        >
                            <ShoppingCart className="size-5" />
                            {t("add-to-cart")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-6 mt-16">
                {book.summaries && book.summaries.length > 0 && (
                    <div>
                        <Title className="text-2xl pb-4" text={t("about")} />
                        <p className="prose leading-relaxed">
                            {book.summaries[0]}
                        </p>
                    </div>
                )}

                <div className="border-t border-neutral/20 pt-6">
                    <Title
                        className="text-2xl pb-4"
                        text={t("recommendation")}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recommendation.map((rec) => (
                            <BookCard key={rec.id} book={rec} />
                        ))}
                    </div>
                    <div className="w-full flex justify-center mt-8">
                        <Link href="/explore" className="btn btn-sm">
                            {t("explore-more")}
                        </Link>
                    </div>
                </div>

                {book.reviews && book.reviews.length > 0 && (
                    <div className="border-t border-neutral/20 pt-6">
                        <Title className="text-2xl pb-4" text={t("reviews")} />
                        <BookReview reviews={book.reviews} />
                    </div>
                )}
            </div>
        </div>
    );
};

type BookReviewProps = {
    reviews: Book["reviews"];
};

type Stats = {
    average: number;
    total: number;
    distribution: Record<string, number>;
};

type RatingBarProps = {
    rating: number;
    count: number;
    total: number;
};

const BookReview: React.FC<BookReviewProps> = ({ reviews }) => {
    const t = useTranslations("pages.book");
    const calculateStats = (): Stats => {
        if (!reviews || reviews.length === 0) {
            return {
                average: 0,
                total: 0,
                distribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
            };
        }

        const distribution = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
        let sum = 0;

        reviews.forEach((review) => {
            sum += review.rating;
            distribution[
                String(Math.round(review.rating)) as keyof typeof distribution
            ]++;
        });

        return {
            average: Number((sum / reviews.length).toFixed(1)),
            total: reviews.length,
            distribution,
        };
    };

    const stats = calculateStats();

    const RatingBar = ({ rating, count, total }: RatingBarProps) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
            <div className="flex items-center gap-3">
                <span className="text-sm text-neutral w-4">{rating}</span>
                <Star className="fill-yellow-500 text-yellow-500" />
                <div className="flex-1 bg-neutral/20 rounded-full h-2 max-w-xs">
                    <div
                        className="bg-neutral h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="text-sm text-neutral w-12 text-right">
                    {percentage}%
                </span>
            </div>
        );
    };

    return (
        <>
            <div className="flex items-start gap-6 mb-8 pb-8">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">
                            {stats.average}
                        </span>
                        <div className="flex gap-1">
                            <Rating reviews={[{ rating: stats.average }]} />
                        </div>
                    </div>
                    <button className="link link-primary link-sm mt-2">
                        {t("reviews-book")}
                    </button>
                </div>

                <div className="flex-1 space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <RatingBar
                            key={rating}
                            rating={rating}
                            count={stats.distribution[String(rating)]}
                            total={stats.total}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-6 lg:px-8">
                <div className="flex items-center justify-between pt-6 border-t border-neutral/20">
                    <h3 className="text-lg font-semibold">
                        {stats.total} {t("reviews")}
                    </h3>
                </div>

                <div className="space-y-6">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="border-b border-neutral/20 pb-6 last:border-0"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        userName={review.user.name}
                                        className="size-10"
                                    />
                                    <div>
                                        <p className="text-sm">
                                            {review.user.name}
                                        </p>
                                        <p className="text-xs text-neutral">
                                            il y a 3 mois • a acheté ce produit
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="my-4">
                                <Rating reviews={[review]} />
                            </div>

                            <h4>{review.title}</h4>
                            <p className="text-sm text-neutral">
                                {review.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default BookDetails;
