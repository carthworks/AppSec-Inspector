"use client";

import { useState } from "react";

export function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create mailto link
        const mailtoLink = `mailto:tkarthikeyan@gmail.com?subject=${encodeURIComponent(
            formData.subject || "Contact from AppSec Inspector Website"
        )}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;
        window.location.href = mailtoLink;
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <section id="contact" className="relative">
            <div className="container-width">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Contact Info */}
                    <div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Get in <span className="text-gradient">Touch</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-10">
                            Have questions, feedback, or need support? We&apos;re here to help!
                        </p>

                        {/* Contact Methods */}
                        <div className="space-y-6 mb-10">
                            <div className="glass glass-hover rounded-xl p-6 flex items-start space-x-4">
                                <div className="text-3xl">📧</div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-1">Email Support</h4>
                                    <a
                                        href="mailto:tkarthikeyan@gmail.com"
                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        tkarthikeyan@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="glass glass-hover rounded-xl p-6 flex items-start space-x-4">
                                <div className="text-3xl">🐛</div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-1">Bug Reports</h4>
                                    <p className="text-gray-400">
                                        Report issues via email or GitHub
                                    </p>
                                </div>
                            </div>

                            <div className="glass glass-hover rounded-xl p-6 flex items-start space-x-4">
                                <div className="text-3xl">💡</div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-1">
                                        Feature Requests
                                    </h4>
                                    <p className="text-gray-400">We&apos;d love to hear your ideas!</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="w-12 h-12 glass glass-hover rounded-full flex items-center justify-center hover:text-blue-400 transition-colors"
                                aria-label="Twitter"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-12 h-12 glass glass-hover rounded-full flex items-center justify-center hover:text-blue-400 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="w-12 h-12 glass glass-hover rounded-full flex items-center justify-center hover:text-blue-400 transition-colors"
                                aria-label="GitHub"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="glass rounded-2xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="Feature Request">Feature Request</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 flex items-center justify-center space-x-2"
                            >
                                <span>📨</span>
                                <span>Send Message</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
