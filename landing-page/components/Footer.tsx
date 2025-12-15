"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Footer() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <footer className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
                <div className="container-width py-12">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        {/* Brand Section */}
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <Image
                                    src="/icons/icon48.png"
                                    alt="AppSec Inspector"
                                    width={40}
                                    height={40}
                                />
                                <span className="text-lg font-bold">AppSec Inspector</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Professional security inspection tool for Chrome. Secure the
                                web, one scan at a time.
                            </p>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        href="#features"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#how-to-use"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        How to Use
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#screenshots"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Screenshots
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#install"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Install Extension
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        href="#contact"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Contact Us
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="mailto:tkarthikeyan@gmail.com"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Email Support
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        href="#how-to-use"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link
                                        href="/privacy"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-400 hover:text-blue-400 transition-colors"
                                    >
                                        License (MIT)
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © 2025 AppSec Inspector. Made with ❤️ for the security community.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Version 1.0.0 | Manifest V3
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </button>
            )}
        </>
    );
}
