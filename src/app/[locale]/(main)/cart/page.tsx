import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Main from "@/components/layout/main";
import Cart from "./cart";

const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("pages.cart");
    return {
        title: t("title"),
        description: t("description"),
    };
};

const Page = async () => {
    return (
        <Main>
            <Cart />
        </Main>
    );
};

export { generateMetadata };
export default Page;
