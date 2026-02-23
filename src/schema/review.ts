import { z } from "zod";

export const CreateReviewSchema = z.object({
    bookId: z.string().min(1, "Book ID is required"),
    rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
    title: z.string().optional(),
    content: z.string().min(1, "Review content is required"),
});

export type CreateReviewSchema = z.infer<typeof CreateReviewSchema>;
