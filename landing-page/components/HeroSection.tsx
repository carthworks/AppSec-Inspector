"use client";

import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
    return (
        <section
            id="hero"
            aria-labelledby="hero-heading"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-30"
            >
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-indigo-600/5 rounded-full blur-3xl" />
            </div>

            <div className="container-width relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left */}
                    <div className="text-center lg:text-left space-y-8">
                        <div className="inline-flex items-center glass px-4 py-2 rounded-full text-sm text-gray-300">
                            Privacy-first browser security tool
                        </div>

                        <h1
                            id="hero-heading"
                            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                        >
                            Professional Security
                            <br />
                            <span className="text-gradient">Inspection</span>
                            <br />
                            for Chrome
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
                            Run security checks directly in your browser. Inspect headers,
                            detect exposed secrets, and audit authentication — all processed
                            locally with <strong className="text-purple-400">zero data collection</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a
                                href="#install"
                                className="cta-button text-lg"
                            >
                                Install Free Extension
                            </a>

                            <Link
                                href="#how-to-use"
                                className="glass glass-hover px-8 py-4 rounded-xl font-semibold text-lg"
                            >
                                Learn How It Works
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-3 gap-6 pt-6 text-sm text-gray-400">
                            <div>
                                <div className="text-2xl font-semibold text-gray-200">Local</div>
                                No cloud processing
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gray-200">30+</div>
                                Secret patterns
                            </div>
                            <div>
                                <div className="text-2xl font-semibold text-gray-200">Zero</div>
                                Tracking or telemetry
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="relative max-w-2xl mx-auto lg:mx-0">
                        <div className="glass rounded-2xl p-2 shadow-2xl shadow-purple-500/10">
                            <div className="bg-slate-950/50 rounded-xl p-2">
                                <Image
                                    src="/promo/marquee_promo_tile.png"
                                    alt="AppSec Inspector browser extension interface"
                                    width={800}
                                    height={600}
                                    priority
                                    className="rounded-lg w-full h-auto"
                                />
                            </div>

                            {/* Floating hints */}
                            <div
                                aria-hidden
                                className="absolute -top-4 -right-4 glass px-4 py-3 rounded-xl shadow-lg hidden sm:block"
                            >
                                <span className="font-semibold text-green-400">
                                    Security Checks: PASS
                                </span>
                            </div>

                            <div
                                aria-hidden
                                className="absolute -bottom-4 -left-4 glass px-4 py-3 rounded-xl shadow-lg hidden sm:block"
                            >
                                <span className="font-semibold text-blue-400">
                                    No secrets detected
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Scroll hint */}
            <div
                aria-hidden
                className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
            >
                <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0 0l-7-7m7 7l7-7" />
                </svg>
            </div>
        </section>
    );
}
