import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { formatAmountForDisplay } from "@/lib/utils";
import type { Books } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import Title from "./title";
import Rating from "./rating";

type BookProps = {
    book: Books[number];
};

const Book: React.FC<BookProps> = ({ book }) => {
    const t = useTranslations("pages.explore");
    const tCommon = useTranslations("common");
    const { addItem } = useCart();

    const handleAddToCart = (book: Books[number]) => {
        addItem(book.id, book.title, book.cover, book.price);
    };

    const authors = book.authors?.join(", ") || tCommon("unknown-author");

    return (
        <div key={book.id} className="group">
            <Link href={`/book/${book.id}`}>
                <div className="relative overflow-hidden rounded-field w-full aspect-9/12">
                    <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        className="rounded-field object-contain transition hover:scale-105"
                    />
                </div>
                <div className="pt-2">
                    <h2 className="text-xl font-bold">
                        {formatAmountForDisplay(book.price)}
                    </h2>

                    <Title
                        text={book.title}
                        className="text-lg font-medium truncate"
                    />

                    <p className="text-sm text-base-content/70 truncate">
                        {authors}
                    </p>
                </div>
            </Link>

            <div className="w-full flex max-xl:flex-col items-center max-xl:items-start justify-between gap-y-2 mt-1 transition opacity-100 group-hover:opacity-100">
                <Rating reviews={book.reviews || []} />
                <button
                    onClick={() => handleAddToCart(book)}
                    className="btn btn-primary btn-sm gap-2 max-xl:w-full"
                >
                    <ShoppingBag className="size-5" />
                    {t("add-to-cart")}
                </button>
            </div>
        </div>
    );
};

export default Book;
