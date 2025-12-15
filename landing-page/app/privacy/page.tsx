import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #0a0f1e 0%, #0f172a 50%, #0a0f1e 100%)' }}>
            <div className="container-width py-32">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    <span>Back to Home</span>
                </Link>

                <div className="glass rounded-3xl p-8 md:p-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Privacy <span className="text-gradient">Policy</span>
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Last updated: December 15, 2025
                    </p>

                    <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Our Commitment to Privacy
                            </h2>
                            <p>
                                AppSec Inspector is built with privacy as a core principle. We
                                believe that security tools should not compromise your privacy.
                                This policy explains our approach to data handling.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Data Collection
                            </h2>
                            <p className="font-semibold text-blue-400">
                                We collect ZERO data. Period.
                            </p>
                            <p>
                                AppSec Inspector performs all analysis locally in your browser.
                                We do not:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Collect any personal information</li>
                                <li>Track your browsing activity</li>
                                <li>Send data to remote servers</li>
                                <li>Use analytics or telemetry</li>
                                <li>Store scan results on our servers</li>
                                <li>Share information with third parties</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Local Storage
                            </h2>
                            <p>
                                The extension uses browser local storage only for:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>
                                    <strong>Theme Preference:</strong> Your choice of light/dark
                                    theme
                                </li>
                                <li>
                                    <strong>Welcome Modal:</strong> Whether you&apos;ve seen the
                                    welcome message
                                </li>
                            </ul>
                            <p className="mt-4">
                                This data never leaves your device and can be cleared at any
                                time through your browser settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Permissions Explained
                            </h2>
                            <p>The extension requests the following permissions:</p>
                            <div className="space-y-4 mt-4">
                                <div className="glass rounded-lg p-4">
                                    <h3 className="font-semibold text-white mb-2">activeTab</h3>
                                    <p className="text-sm">
                                        Required to access and analyze the current tab&apos;s content
                                        when you initiate a scan.
                                    </p>
                                </div>
                                <div className="glass rounded-lg p-4">
                                    <h3 className="font-semibold text-white mb-2">storage</h3>
                                    <p className="text-sm">
                                        Used to save your theme preference and welcome modal state
                                        locally.
                                    </p>
                                </div>
                                <div className="glass rounded-lg p-4">
                                    <h3 className="font-semibold text-white mb-2">cookies</h3>
                                    <p className="text-sm">
                                        Required to read cookies for security analysis (e.g.,
                                        checking Secure, HttpOnly flags).
                                    </p>
                                </div>
                                <div className="glass rounded-lg p-4">
                                    <h3 className="font-semibold text-white mb-2">webRequest</h3>
                                    <p className="text-sm">
                                        Used to capture HTTP headers for security analysis.
                                    </p>
                                </div>
                                <div className="glass rounded-lg p-4">
                                    <h3 className="font-semibold text-white mb-2">scripting</h3>
                                    <p className="text-sm">
                                        Allows the extension to inject analysis code into the current
                                        tab when you click a scan button. This is only used when you
                                        explicitly initiate a scan and provides better privacy than
                                        automatic background access.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                How Analysis Works
                            </h2>
                            <p>When you run a scan:</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4">
                                <li>You manually click a scan button</li>
                                <li>The extension analyzes the current page locally</li>
                                <li>Results are displayed in the extension popup</li>
                                <li>No data is transmitted anywhere</li>
                                <li>Results are not stored (unless you export them locally)</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Export Functionality
                            </h2>
                            <p>
                                When you export scan results (JSON, TXT, or PDF), the files are
                                created locally on your device. We do not receive copies of
                                these exports.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Third-Party Services
                            </h2>
                            <p>
                                AppSec Inspector does not integrate with any third-party
                                services, analytics platforms, or advertising networks.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Updates to This Policy
                            </h2>
                            <p>
                                If we ever change our privacy practices, we will update this
                                policy and notify users through the extension. However, our
                                core commitment to zero data collection will never change.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Contact Us
                            </h2>
                            <p>
                                If you have questions about this privacy policy, please contact
                                us:
                            </p>
                            <p className="mt-4">
                                <strong>Email:</strong>{" "}
                                <a
                                    href="mailto:tkarthikeyan@gmail.com"
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    tkarthikeyan@gmail.com
                                </a>
                            </p>
                        </section>

                        <div className="glass rounded-xl p-6 mt-8 bg-blue-600/10 border-blue-500/30">
                            <p className="text-center font-semibold text-blue-300">
                                🔒 Your privacy is our priority. Always.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
