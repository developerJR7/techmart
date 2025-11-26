import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "TechMart - E-commerce Profissional",
    description: "Plataforma completa de e-commerce com tecnologia de ponta. Produtos de qualidade, pagamento seguro e entrega rápida.",
    keywords: ["e-commerce", "loja online", "tecnologia", "produtos", "compras online"],
    authors: [{ name: "TechMart" }],
    openGraph: {
        title: "TechMart - E-commerce Profissional",
        description: "Plataforma completa de e-commerce com tecnologia de ponta",
        type: "website",
        locale: "pt_BR",
    },
    twitter: {
        card: "summary_large_image",
        title: "TechMart - E-commerce Profissional",
        description: "Plataforma completa de e-commerce com tecnologia de ponta",
    },
    robots: {
        index: true,
        follow: true,
    },
};
