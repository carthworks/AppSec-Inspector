import Image from "next/image";

export function PromoSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="container-width">
                {/* Marquee Promo */}
                <div className="max-w-6xl mx-auto">
                    <div className="glass rounded-3xl overflow-hidden">
                        <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 p-1">
                            <div className="bg-slate-950/80 rounded-3xl p-8 md:p-12">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                        Professional Security <span className="text-gradient">Analysis</span>
                                    </h2>
                                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                        Comprehensive security inspection with real-time analysis,
                                        detailed reporting, and actionable recommendations.
                                    </p>
                                </div>

                                <div className="relative rounded-2xl overflow-hidden bg-slate-900/50 p-4">
                                    <Image
                                        src="/promo/marquee_promo_tile.png"
                                        alt="AppSec Inspector Marquee"
                                        width={1400}
                                        height={560}
                                        className="w-full h-auto rounded-xl"
                                        priority
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-8 mt-12">
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                                            100%
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">
                                            Local analysis with zero data transmission
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                                            Real-time
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">
                                            Instant security insights as you browse
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                                            Pro-grade
                                        </div>
                                        <p className="text-gray-400 leading-relaxed">
                                            Enterprise-level security analysis
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
