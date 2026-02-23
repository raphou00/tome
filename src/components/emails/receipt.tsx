import { Container, Link, Row, Section, Text } from "@react-email/components";
import Template from "./template";
import type { T } from "@/lib/types";

type ReceiptEmailProps = {
    t: T;
    name: string;
    receiptUrl: string;
    downloadLinks?: { title: string; url: string }[];
};

const Receipt: React.FC<ReceiptEmailProps> = async ({
    t,
    name,
    receiptUrl,
    downloadLinks,
}) => {
    return (
        <Template
            t={t}
            title={t("emails.receipt.title")}
            body={t("emails.receipt.body")}
        >
            <Section>
                <Container>
                    <Row className="my-6">
                        <Text className="text-xl font-bold">
                            {t("emails.receipt.hello", { name })}
                        </Text>
                        <Text>{t("emails.receipt.body")}</Text>
                    </Row>
                    <Row className="my-6">
                        <Link
                            href={receiptUrl}
                            className="rounded-full bg-primary w-1/2 px-6 py-4 text-center text-xl font-bold text-white"
                        >
                            {t("emails.receipt.link")}
                        </Link>
                    </Row>
                    {downloadLinks && downloadLinks.length > 0 && (
                        <>
                            <Row className="my-6">
                                <Text className="text-lg font-bold">
                                    {t("emails.receipt.downloadBooks")}
                                </Text>
                            </Row>
                            {downloadLinks.map((link, index) => (
                                <Row key={index} className="my-2">
                                    <Link
                                        href={link.url}
                                        className="text-primary"
                                    >
                                        {link.title}
                                    </Link>
                                </Row>
                            ))}
                        </>
                    )}
                </Container>
            </Section>
        </Template>
    );
};

export default Receipt;
