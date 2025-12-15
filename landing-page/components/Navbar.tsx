"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Handle scroll (passive + minimal updates)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav
            role="navigation"
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-lg shadow-blue-500/10" : "bg-transparent"
                }`}
        >
            <div className="container-width">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/icons/icon128.png"
                            alt="AppSec Inspector logo"
                            width={48}
                            height={48}
                            priority
                        />
                        <span className="text-lg md:text-xl font-bold text-white">
                            AppSec Inspector
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-to-use" className="nav-link">How to Use</a>
                        <a href="#screenshots" className="nav-link">Screenshots</a>
                        <a href="#contact" className="nav-link">Contact</a>
                        <a
                            href="#install"
                            className="cta-button"
                        >
                            Install Extension
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        type="button"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setIsMobileMenuOpen((v) => !v)}
                        className="md:hidden p-2 text-gray-300 hover:text-white"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        id="mobile-menu"
                        className="md:hidden glass rounded-lg mt-2 mb-4"
                    >
                        <div className="flex flex-col space-y-4 px-4 py-4">
                            <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                            <a href="#how-to-use" onClick={() => setIsMobileMenuOpen(false)}>How to Use</a>
                            <a href="#screenshots" onClick={() => setIsMobileMenuOpen(false)}>Screenshots</a>
                            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
                            <a
                                href="#install"
                                className="cta-button text-center button"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Install Extension 4
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
