import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Main from "@/components/layout/main";
import Explore from "./explore";
import { getBooksExplore, getBooksCount } from "@/lib/book";

const PER_PAGE = 20;

const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("pages.explore");
    return {
        title: t("title"),
        description: t("description"),
    };
};

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string; sort?: string }>;
}) => {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const perPage = PER_PAGE;
    const skip = (page - 1) * perPage;

    const [books, totalBooks] = await Promise.all([
        getBooksExplore({ take: perPage, skip }),
        getBooksCount(),
    ]);

    return (
        <Main>
            <Explore
                books={books}
                totalBooks={totalBooks}
                currentPage={page}
                perPage={perPage}
            />
        </Main>
    );
};

export { generateMetadata };
export default Page;
