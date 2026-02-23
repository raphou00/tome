"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import FormButton from "@/components/ui/form-button";
import FormResponse from "@/components/ui/form-response";

type ReviewFormProps = {
    bookId: string;
    onSuccess?: () => void;
};

export const ReviewForm: React.FC<ReviewFormProps> = ({
    bookId,
    onSuccess,
}) => {
    const t = useTranslations("pages.book");
    const tMessages = useTranslations("messages");

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (rating === 0) {
            setError(t("rating-required"));
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/books/${bookId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookId,
                    rating,
                    title: title || null,
                    content,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || tMessages("server-error"));
                return;
            }

            setSuccess(t("review-submitted"));
            setTitle("");
            setContent("");
            setRating(0);
            onSuccess?.();
        } catch {
            setError(tMessages("server-error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {(error || success) && (
                <FormResponse message={error || success} success={!!success} />
            )}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    {t("your-rating")}
                </label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8 transition-colors",
                                    star <= (hoverRating || rating) ?
                                        "fill-yellow-400 text-yellow-400"
                                    :   "fill-base-300 text-base-300"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-bold">
                        {t("review-title")}
                    </span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("review-title-placeholder")}
                    className="input input-bordered w-full"
                    maxLength={100}
                />
            </div>

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text font-bold">
                        {t("review-content")}
                    </span>
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("review-content-placeholder")}
                    className="textarea textarea-bordered w-full min-h-[120px]"
                    maxLength={1000}
                    required
                />
            </div>

            <FormButton title={t("submit-review")} loading={loading} />
        </form>
    );
};
