import { Funnel_Display as Font } from "next/font/google";
import { title } from "@/config/seo";
import { cn } from "@/lib/utils";

const font = Font({
    subsets: ["latin"],
    weight: "700",
});

type LogoTextProps = {
    className?: string;
};

const LogoText: React.FC<LogoTextProps> = ({ className }) => {
    return (
        <span className={cn("text-4xl text-accent", font.className, className)}>
            {title}
        </span>
    );
};

export default LogoText;
