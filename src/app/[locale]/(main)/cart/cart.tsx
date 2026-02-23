"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { formatAmountForDisplay } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import Title from "@/components/ui/title";

const Cart: React.FC = () => {
    const t = useTranslations("pages.cart");
    const { state, removeItem } = useCart();

    return (
        <>
            <Title text={t("title")} className="text-3xl lg:text-4xl" />
            <div className="mt-6 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <div className="lg:col-span-7">
                    {state.items.length === 0 ?
                        <p className="text-base-content/60 py-8">
                            Your cart is empty
                        </p>
                    :   state.items.map((item) => (
                            <div
                                key={item.bookId}
                                className="flex py-6 sm:py-10 border-b border-neutral/20 last:border-none"
                            >
                                <div className="shrink-0">
                                    <Image
                                        alt={item.title}
                                        src={item.cover}
                                        width={512}
                                        height={512}
                                        className="size-24 rounded-box object-cover sm:size-48"
                                    />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                        <div>
                                            <div className="flex flex-col justify-between">
                                                <Title
                                                    className="mt-1 text-base font-medium text-gray-900"
                                                    text={formatAmountForDisplay(
                                                        item.price
                                                    )}
                                                />
                                                <Title
                                                    text={item.title}
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div className="mt-1 flex text-sm">
                                                <span className="badge badge-outline">
                                                    eBook
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 sm:mt-0 sm:pr-9">
                                            <div className="absolute top-0 right-0">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(
                                                            item.bookId,
                                                            item.title
                                                        )
                                                    }
                                                    className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                                                >
                                                    <X
                                                        aria-hidden="true"
                                                        className="size-5"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="mt-8 rounded-box bg-base-200 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                    <Title text={t("summary")} />

                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Subtotal</dt>
                            <dd className="text-sm font-medium text-gray-900">
                                {formatAmountForDisplay(state.total)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="flex text-sm text-gray-600">
                                <span>Tax</span>
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">
                                $0.00
                            </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">
                                Total
                            </dt>
                            <dd className="text-base font-medium text-gray-900">
                                {formatAmountForDisplay(state.total)}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-6">
                        <a
                            href="/api/stripe/create-checkout"
                            className="btn btn-primary w-full"
                        >
                            {t("checkout")}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
