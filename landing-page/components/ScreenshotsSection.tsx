import Image from "next/image";

export function ScreenshotsSection() {
    const screenshots = [
        {
            src: "/screenshots/appsec-score-board-01.png",
            caption: "Security Score Dashboard",
        },
        {
            src: "/screenshots/appsec-fix-02.png",
            caption: "Auto-Fix Code Snippets",
        },
        {
            src: "/screenshots/appsec-secrets-03.png",
            caption: "Secret Detection Results",
        },
        {
            src: "/screenshots/appsec-auth-session-04.png",
            caption: "Auth & Session Analysis",
        },
        {
            src: "/screenshots/appsec-share-05.png",
            caption: "Export & Share Options",
        },
    ];

    return (
        <section id="screenshots" className="relative">
            <div className="container-width">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                        See It In <span className="text-gradient">Action</span>
                    </h2>
                    <p className="text-lg text-gray-400">
                        Professional interface with powerful security analysis
                    </p>
                </div>

                {/* Screenshots Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {screenshots.map((screenshot, index) => (
                        <div
                            key={index}
                            className="group glass rounded-2xl p-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                        >
                            <div className="relative overflow-hidden rounded-xl mb-4 bg-slate-950/50 p-2">
                                <Image
                                    src={screenshot.src}
                                    alt={screenshot.caption}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105 rounded-lg"
                                />
                            </div>
                            <p className="text-center font-semibold text-gray-300">
                                {screenshot.caption}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
