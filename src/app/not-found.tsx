"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1E90FF]/10 to-[#0066CC]/10 dark:from-[#1E90FF]/5 dark:to-[#0066CC]/5">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mb-8"
                    >
                        <h1 className="text-9xl font-bold text-[#1E90FF] mb-4">404</h1>
                        <h2 className="text-3xl font-bold mb-2">Página não encontrada</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Ops! A página que você está procurando não existe.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link href="/">
                            <Button size="lg" className="gap-2">
                                <Home className="h-5 w-5" />
                                Voltar ao Início
                            </Button>
                        </Link>
                        <Link href="/products">
                            <Button size="lg" variant="outline" className="gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Ver Produtos
                            </Button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-12"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Precisa de ajuda?{" "}
                            <Link href="/contact" className="text-[#1E90FF] hover:underline">
                                Entre em contato
                            </Link>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
