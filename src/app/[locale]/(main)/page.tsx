import { getUser } from "@/lib/auth";
import Main from "@/components/layout/main";
import { Home } from "./home";
import { getBestsellers, getBooksCarousel } from "@/lib/book";

const Page = async () => {
    const user = await getUser();
    const carouselBooks = await getBooksCarousel();
    const bestsellers = await getBestsellers();

    return (
        <Main>
            <Home
                user={user?.user || null}
                carouselBooks={carouselBooks}
                bestsellers={bestsellers}
            />
        </Main>
    );
};

export default Page;
