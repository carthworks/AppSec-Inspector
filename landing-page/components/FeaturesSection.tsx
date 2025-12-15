export function FeaturesSection() {
    const features = [
        {
            icon: "🛡️",
            title: "Security Header Inspector",
            description:
                "Analyze HTTP security headers with OWASP Top 10 mapping. Get severity-based findings and detailed remediation recommendations.",
            highlights: [
                "CSP, HSTS, X-Frame-Options analysis",
                "OWASP Top 10 2021 mapping",
                "Severity levels (PASS/WARN/FAIL)",
                "Best practice guidance",
            ],
        },
        {
            icon: "🔑",
            title: "Token & Secret Detector",
            description:
                "Scan DOM, JavaScript, and network requests for exposed secrets. Detect 30+ types including AWS keys, JWT tokens, API keys, and more.",
            highlights: [
                "30+ secret pattern types",
                "Smart secret masking",
                "False positive filtering",
                "Location tracking (DOM/JS/Network)",
            ],
            featured: true,
        },
        {
            icon: "🔐",
            title: "Auth & Session Checker",
            description:
                "Comprehensive authentication and session security analysis. Check cookie security, JWT validation, and session management.",
            highlights: [
                "Cookie security analysis",
                "JWT token decoding & validation",
                "Session management audit",
                "Token expiration checking",
            ],
        },
        {
            icon: "📊",
            title: "Security Score & Grade",
            description:
                "Get a comprehensive 0-100 security score with letter grade (A-F). Weighted breakdown with color-coded display and actionable insights.",
            highlights: [
                "0-100 comprehensive rating",
                "Executive-friendly letter grades",
                "Weighted breakdown analysis",
                "Real-time score updates",
            ],
        },
        {
            icon: "✅",
            title: "Auto-Fix Code Snippets",
            description:
                "Copy-paste ready configuration fixes for multiple platforms. Nginx, Apache, Node.js/Express, and Spring Boot support.",
            highlights: [
                "Multi-platform support",
                "One-click copy functionality",
                "7 security headers covered",
                "Production-ready code",
            ],
        },
        {
            icon: "📤",
            title: "Export & Share",
            description:
                "Export findings in JSON, TXT, or PDF formats. Share results via Twitter, LinkedIn, or copy to clipboard.",
            highlights: [
                "Multiple export formats",
                "Professional PDF reports",
                "Social media sharing",
                "Clipboard integration",
            ],
        },
    ];

    return (
        <section id="features" className="relative">
            <div className="container-width">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        Powerful Security <span className="text-gradient">Features</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Everything you need for comprehensive web application security
                        analysis
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`glass glass-hover rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:scale-105 ${feature.featured
                                ? "ring-2 ring-purple-500/50 relative"
                                : ""
                                }`}
                        >
                            {feature.featured && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-xs font-semibold">
                                    Most Popular
                                </div>
                            )}

                            <div className="text-5xl mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 mb-4">{feature.description}</p>

                            <ul className="space-y-2">
                                {feature.highlights.map((highlight, i) => (
                                    <li key={i} className="flex items-start space-x-2 text-sm">
                                        <span className="text-purple-400 mt-0.5">✓</span>
                                        <span className="text-gray-300">{highlight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
