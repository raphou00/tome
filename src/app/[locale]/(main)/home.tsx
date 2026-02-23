"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import type { User } from "lucia";
import { useMotionValue, motion } from "framer-motion";
import {
    ArrowRight,
    Star,
    BookOpen,
    Download,
    Sparkles,
    Heart,
    Zap,
    CheckCircle,
    Library,
} from "lucide-react";
import type { Books } from "@/lib/types";
import { cn } from "@/lib/utils";
import Title from "@/components/ui/title";
import Book from "@/components/ui/book";

type CarouselProps = {
    user: User | null;
    carouselBooks: Books;
    bestsellers: Books;
};

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 8;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
    type: "spring",
    mass: 3,
    stiffness: 400,
    damping: 50,
};

const COLORS = [
    "#4242fa88",
    "#fa42bf88",
    "#42bf4288",
    "#fa424288",
    "#fabf4288",
];

export const Home: React.FC<CarouselProps> = ({
    user,
    carouselBooks,
    bestsellers,
}) => {
    const tFeatures = useTranslations("pages.home.features");
    const tBestsellers = useTranslations("pages.home.bestsellers");
    const tWhyChoose = useTranslations("pages.home.why-choose");
    const tTestimonials = useTranslations("pages.home.testimonials");
    const tWelcome = useTranslations("pages.home.welcome");
    const tCta = useTranslations("pages.home.cta");
    const tHero = useTranslations("pages.home.hero");

    const [cardIndex, setCardIndex] = useState(0);
    const dragX = useMotionValue(0);

    const carouselData = carouselBooks.length > 0 ? carouselBooks : [];

    useEffect(() => {
        if (carouselData.length === 0) return;
        const intervalRef = setInterval(() => {
            const x = dragX.get();
            if (x === 0) {
                setCardIndex((pv) =>
                    pv === carouselData.length - 1 ? 0 : pv + 1
                );
            }
        }, AUTO_DELAY);
        return () => clearInterval(intervalRef);
    }, [dragX, carouselData.length]);

    const onDragEnd = () => {
        const x = dragX.get();
        if (carouselData.length === 0) return;
        if (x <= -DRAG_BUFFER && cardIndex < carouselData.length - 1) {
            setCardIndex((pv) => pv + 1);
        } else if (x >= DRAG_BUFFER && cardIndex > 0) {
            setCardIndex((pv) => pv - 1);
        }
    };

    const features = [
        {
            icon: Download,
            title: tFeatures("instant-download"),
            description: tFeatures("instant-download-desc"),
        },
        {
            icon: BookOpen,
            title: tFeatures("pdf-format"),
            description: tFeatures("pdf-format-desc"),
        },
        {
            icon: Star,
            title: tFeatures("high-quality"),
            description: tFeatures("high-quality-desc"),
        },
        {
            icon: Heart,
            title: tFeatures("family-friendly"),
            description: tFeatures("family-friendly-desc"),
        },
    ];

    const testimonials = [
        {
            name: "Sarah M.",
            rating: 5,
            text: "My kids absolutely love these books! The illustrations are beautiful and the stories are engaging.",
        },
        {
            name: "John D.",
            rating: 5,
            text: "Great instant download. Perfect for bedtime stories. My daughter asks for them every night!",
        },
        {
            name: "Emily R.",
            rating: 5,
            text: "Amazing value for the quality. We have the whole collection now. Highly recommend!",
        },
    ];

    return (
        <div className="space-y-16">
            <section>
                <div className="relative overflow-hidden">
                    {carouselData.length > 0 ?
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            style={{ x: dragX }}
                            animate={{ translateX: `-${cardIndex * 100}%` }}
                            transition={SPRING_OPTIONS}
                            onDragEnd={onDragEnd}
                            className="flex cursor-grab active:cursor-grabbing"
                        >
                            {carouselData.map((book, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "w-full shrink-0 relative min-h-[60vh] flex items-center bg-base-300"
                                    )}
                                    style={{
                                        backgroundImage: `radial-gradient(88% 100% at top, ${COLORS[idx]}, rgba(255,255,255,0))`,
                                    }}
                                >
                                    <div className="container mx-auto px-10 py-8 grid md:grid-cols-2 gap-12 items-center">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-6 z-10"
                                        >
                                            <span className="badge badge-lg badge-primary mb-3">
                                                {book.authors}
                                            </span>
                                            <Title
                                                text={book.title}
                                                className="text-2xl md:text-4xl font-black"
                                            />
                                            <p className="text-lg md:text-xl text-base-content/80 max-w-md">
                                                {book.summaries?.[0]?.slice(
                                                    0,
                                                    80
                                                )}
                                                ...
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                <Link
                                                    href={`/book/${book.id}`}
                                                    className="btn btn-primary btn-lg"
                                                >
                                                    {tHero("cta-shop")}
                                                    <ArrowRight className="w-5 h-5" />
                                                </Link>
                                                <Link
                                                    href="/explore"
                                                    className="btn btn-outline btn-lg"
                                                >
                                                    {tHero("cta-browse")}
                                                </Link>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="relative flex justify-center"
                                        >
                                            <div className="relative overflow-hidden rounded-field w-72 aspect-9/12">
                                                <Image
                                                    src={book.cover}
                                                    alt={book.title}
                                                    fill
                                                    priority
                                                    className="rounded-field object-contain transition hover:scale-105"
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    :   null}
                    {carouselData.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                            {carouselData.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCardIndex(idx)}
                                    className={cn(
                                        "w-3 h-3 rounded-box transition-all",
                                        idx === cardIndex ? "bg-primary w-6" : (
                                            "bg-base-content/30"
                                        )
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex flex-col items-center text-center p-6 rounded-box bg-base-200"
                        >
                            <div className="p-3 rounded-box bg-primary/10 mb-4">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">{feature.title}</h3>
                            <p className="text-sm text-base-content/70">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <Title
                            text={tBestsellers("title")}
                            className="text-3xl md:text-4xl"
                        />
                        <p className="text-base-content/70 mt-2">
                            {tBestsellers("subtitle")}
                        </p>
                    </div>
                    <Link href="/explore" className="btn btn-ghost">
                        {tBestsellers("view-all")}{" "}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {bestsellers.map((book, idx) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Book book={book} />
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="bg-base-200 py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <Title
                                text={tWhyChoose("title")}
                                className="text-3xl md:text-4xl"
                            />
                            <p className="text-base-content/70 mt-4 mb-8">
                                {tWhyChoose("description")}
                            </p>
                            <div className="space-y-4">
                                {[
                                    tWhyChoose("instant-delivery"),
                                    tWhyChoose("pdf-compatible"),
                                    tWhyChoose("print-friendly"),
                                    tWhyChoose("lifetime-access"),
                                    tWhyChoose("secure-checkout"),
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-success" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-base-100 p-6 rounded-box text-center">
                                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                                <div className="text-3xl font-black">
                                    {tWhyChoose("instant")}
                                </div>
                                <div className="text-base-content/60">
                                    {tWhyChoose("delivery")}
                                </div>
                            </div>
                            <div className="bg-base-100 p-6 rounded-box text-center">
                                <Download className="w-8 h-8 text-secondary mx-auto mb-2" />
                                <div className="text-3xl font-black">
                                    {tWhyChoose("pdf")}
                                </div>
                                <div className="text-base-content/60">
                                    {tWhyChoose("format")}
                                </div>
                            </div>
                            <div className="bg-base-100 p-6 rounded-box text-center">
                                <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                                <div className="text-3xl font-black">4.9</div>
                                <div className="text-base-content/60">
                                    {tWhyChoose("rating")}
                                </div>
                            </div>
                            <div className="bg-base-100 p-6 rounded-box text-center">
                                <Heart className="w-8 h-8 text-error mx-auto mb-2" />
                                <div className="text-3xl font-black">1000+</div>
                                <div className="text-base-content/60">
                                    {tWhyChoose("readers")}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <Title
                        text={tTestimonials("title")}
                        className="text-3xl md:text-4xl"
                    />
                    <p className="text-base-content/70 mt-2">
                        {tTestimonials("subtitle")}
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((review, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-base-200 p-6 rounded-box"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <p className="mb-4">&ldquo;{review.text}&rdquo;</p>
                            <div className="font-bold">{review.name}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {user && (
                <section className="container mx-auto px-6">
                    <div className="card bg-gradient-to-r from-primary to-secondary p-8 shadow-xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-primary-content">
                                <Title
                                    text={tWelcome("title")}
                                    className="text-2xl lg:text-3xl text-primary-content"
                                />
                                <p className="mt-2 text-primary-content/80">
                                    {tWelcome("description")}
                                </p>
                            </div>
                            <Link href="/library" className="btn btn-accent">
                                <Library className="w-5 h-5" />
                                {tWelcome("cta")}
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="container mx-auto px-6 pb-20">
                <div className="card bg-base-200 p-8 md:p-12 text-center">
                    <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                    <Title
                        text={tCta("title")}
                        className="text-3xl md:text-4xl"
                    />
                    <p className="text-base-content/70 mt-4 mb-8 max-w-md mx-auto">
                        {tCta("description")}
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/explore"
                            className="btn btn-primary btn-lg"
                        >
                            {tCta("shop-now")}{" "}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        {!user && (
                            <Link
                                href="/register"
                                className="btn btn-outline btn-lg"
                            >
                                {tCta("create-account")}
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
