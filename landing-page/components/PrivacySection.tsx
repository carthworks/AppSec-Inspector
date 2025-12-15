type PrivacyFeature = {
    id: string;
    title: string;
    description: string;
};

const PRIVACY_FEATURES: PrivacyFeature[] = [
    {
        id: "local",
        title: "100% Local Processing",
        description: "All analysis runs directly in your browser."
    },
    {
        id: "no-data",
        title: "Zero Data Collection",
        description: "No tracking, telemetry, or analytics of any kind."
    },
    {
        id: "offline",
        title: "No Remote Servers",
        description: "Works fully offline with no external connections."
    },
    {
        id: "readonly",
        title: "Read-Only Inspection",
        description: "Your data is never modified or transmitted."
    }
];

export function PrivacySection() {
    return (
        <section
            aria-labelledby="privacy-heading"
            className="relative"
        >
            <div className="container-width">
                <div className="glass rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-5xl mx-auto">

                    {/* Icon */}
                    <div
                        aria-hidden
                        className="text-5xl mb-6"
                    >
                        🔐
                    </div>

                    {/* Heading */}
                    <h2
                        id="privacy-heading"
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
                    >
                        Privacy First,
                        <span className="text-gradient"> Always</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Your data never leaves your device. Auto Formatter Pro is designed
                        with a strict local-only architecture — no uploads, no tracking,
                        and no hidden network activity.
                    </p>

                    {/* Features */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {PRIVACY_FEATURES.map((feature) => (
                            <div
                                key={feature.id}
                                className="glass glass-hover rounded-xl p-6 transition-all duration-300 hover:scale-105"
                            >
                                <h3 className="font-semibold text-gray-100 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
