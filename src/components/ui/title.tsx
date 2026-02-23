"use client";

import { Funnel_Display as Font } from "next/font/google";
import { cn } from "@/lib/utils";

type TitleProps = {
    text: string;
    className?: string;
};

const font = Font({
    subsets: ["latin"],
    weight: "800",
});

const Title: React.FC<TitleProps> = ({ text, className }: TitleProps) => {
    return (
        <h1 className={cn("text-2xl", className, font.className)}>{text}</h1>
    );
};

export default Title;
