import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Main from "@/components/layout/main";
import Library from "./library";

const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("pages.library");
    return {
        title: t("title"),
        description: t("description"),
    };
};

const Page = async () => {
    return (
        <Main>
            <Library />
        </Main>
    );
};

export { generateMetadata };
export default Page;
