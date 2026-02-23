"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Download, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import axios from "axios";

type PurchasedBook = {
    id: string;
    bookId: string;
    createdAt: string;
    book: {
        id: string;
        title: string;
        cover: string;
        file: string;
    };
};

const Library = () => {
    const t = useTranslations("pages.library");
    const tMessages = useTranslations("messages");
    const searchParams = useSearchParams();
    const [books, setBooks] = useState<PurchasedBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const success = searchParams.get("success");

    useEffect(() => {
        if (success === "true") {
            toast.success(tMessages("payment-success"));
        }
    }, [success, tMessages]);

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const response = await axios.get("/api/library");
                setBooks(response.data.books);
            } catch (error) {
                console.error("Failed to fetch library:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLibrary();
    }, []);

    const handleDownload = async (bookId: string) => {
        setDownloadingId(bookId);
        try {
            const response = await axios.get(`/api/books/${bookId}/download`);
            window.open(response.data.downloadUrl, "_blank");
        } catch {
            toast.error(tMessages("server-error"));
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                <BookOpen className="h-16 w-16 text-base-content/30" />
                <p className="text-lg text-base-content/60">{t("empty")}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {books.map((item) => (
                    <div key={item.id} className="card bg-base-200 shadow-xl">
                        <figure className="relative aspect-[3/4]">
                            <Image
                                src={item.book.cover}
                                alt={item.book.title}
                                fill
                                className="object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title line-clamp-2">
                                {item.book.title}
                            </h2>
                            <div className="card-actions mt-4">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDownload(item.bookId)}
                                    disabled={downloadingId === item.bookId}
                                >
                                    {downloadingId === item.bookId ?
                                        <span className="loading loading-spinner loading-sm"></span>
                                    :   <Download className="h-4 w-4" />}
                                    {t("download")}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
