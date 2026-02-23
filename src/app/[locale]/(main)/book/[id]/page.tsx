import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Main from "@/components/layout/main";
import BookDetails from "./book";
import { getBookDetails, getBestsellers } from "@/lib/book";

const generateMetadata = async ({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> => {
    const { id: bookId } = await params;
    const book = await getBookDetails(bookId);

    if (!book) {
        return {
            title: "Book Not Found",
        };
    }

    return {
        title: book.title,
        description: book.summaries?.[0] || "",
    };
};

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id: bookId } = await params;
    const book = await getBookDetails(bookId);

    if (!book) {
        return redirect("/");
    }

    const recommendation = await getBestsellers();

    return (
        <Main>
            <BookDetails book={book} recommendation={recommendation} />
        </Main>
    );
};

export { generateMetadata };
export default Page;
