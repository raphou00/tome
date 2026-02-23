import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type RatingProps = {
    reviews: { rating: number }[];
    reviewsNumber?: boolean;
};

const Rating: React.FC<RatingProps> = ({ reviews, reviewsNumber = false }) => {
    const t = useTranslations("common");
    const totalRatings = reviews.length;
    const averageRating =
        totalRatings === 0 ? 0 : (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalRatings
        );

    const stars = Array.from({ length: 10 }, (_, i) => {
        const starValue = (i + 1) * 0.5;
        const isFilled = starValue <= averageRating;

        return (
            <div
                key={i}
                className={cn(
                    "mask mask-star-2 bg-yellow-500",
                    i % 2 === 0 ? "mask-half-1" : "mask-half-2"
                )}
                aria-current={isFilled ? "true" : "false"}
            />
        );
    });

    return (
        <div className="flex items-center gap-x-2">
            <div className="rating rating-xs rating-half">{stars}</div>
            <span className="text-xs text-base-content/70">
                ({averageRating.toFixed(1)})
                {reviewsNumber ?
                    ` • ${t("reviews", { count: totalRatings })}`
                :   ""}
            </span>
        </div>
    );
};

export default Rating;
