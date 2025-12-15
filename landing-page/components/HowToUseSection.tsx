"use client";

import { useState } from "react";
import Image from "next/image";

export function HowToUseSection() {
    const [activeTab, setActiveTab] = useState("headers");

    const steps = [
        {
            number: "1",
            title: "Install Extension",
            description:
                "Add AppSec Inspector to Chrome from the Web Store or load it manually. The extension icon will appear in your toolbar.",
            code: "chrome://extensions/ → Load unpacked",
        },
        {
            number: "2",
            title: "Navigate & Scan",
            description:
                "Visit the website you want to inspect. Click the AppSec Inspector icon and choose your scan type: Headers, Secrets, or Auth & Session.",
            image: "/screenshots/appsec-secrets-03.png",
        },
        {
            number: "3",
            title: "Review & Fix",
            description:
                "Review findings with severity levels and recommendations. Copy auto-fix code snippets and export reports for your team.",
            image: "/screenshots/appsec-fix-02.png",
        },
    ];

    const tabs = [
        {
            id: "headers",
            label: "Security Headers",
            title: "Security Headers Scan",
            steps: [
                "Navigate to the website you want to inspect",
                "Click the AppSec Inspector icon in your toolbar",
                'Go to the Headers tab',
                'Click Scan Security Headers',
                "Review findings with severity levels (PASS/WARN/FAIL)",
                "Read detailed recommendations for each header",
                "Copy auto-fix code snippets for your platform",
            ],
            image: "/screenshots/appsec-score-board-01.png",
        },
        {
            id: "secrets",
            label: "Secret Detection",
            title: "Secret Detection Scan",
            steps: [
                "Navigate to the target application",
                "Click the AppSec Inspector icon",
                'Go to the Secrets tab',
                'Click Scan for Secrets',
                "Review detected tokens and their locations",
                "Check secret types (JWT, AWS, API keys, etc.)",
                "Follow remediation guidance to secure exposed secrets",
            ],
            image: "/screenshots/appsec-secrets-03.png",
        },
        {
            id: "auth",
            label: "Auth & Session",
            title: "Authentication & Session Audit",
            steps: [
                "Navigate to an authenticated application",
                "Click the AppSec Inspector icon",
                'Go to the Auth & Session tab',
                'Click Check Auth',
                "Review cookie security analysis",
                "Check JWT token validation and expiration",
                "Implement recommended security fixes",
            ],
            image: "/screenshots/appsec-auth-session-04.png",
        },
    ];

    const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

    return (
        <section id="how-to-use" className="relative">
            <div className="container-width">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        How to Use <span className="text-gradient">AppSec Inspector</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Get started in minutes with our simple 3-step process
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold mb-6">
                                {step.number}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-400 mb-6">{step.description}</p>
                            {step.code && (
                                <div className="glass rounded-lg p-4 font-mono text-sm text-blue-300">
                                    {step.code}
                                </div>
                            )}
                            {step.image && (
                                <div className="rounded-lg overflow-hidden mt-6 bg-slate-950/50 p-2">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        width={400}
                                        height={300}
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Detailed Usage Tabs */}
                <div className="glass rounded-3xl p-8 md:p-12">
                    {/* Tab Buttons */}
                    <div className="flex flex-wrap gap-4 mb-8 justify-center">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab.id
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                                    : "glass glass-hover text-gray-300"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-6">{activeTabData.title}</h3>
                            <ol className="space-y-4">
                                {activeTabData.steps.map((step, index) => (
                                    <li key={index} className="flex items-start space-x-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-sm font-semibold mt-0.5">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: step }} />
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="glass rounded-xl p-2 bg-slate-950/30">
                            <Image
                                src={activeTabData.image}
                                alt={activeTabData.title}
                                width={800}
                                height={600}
                                className="rounded-lg w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
