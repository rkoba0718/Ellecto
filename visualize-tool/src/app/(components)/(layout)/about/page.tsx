"use client";

import React from "react";
import Image from "next/image";

const About: React.FC = () => {
    return (
        <div className="container mx-auto px-10 py-10 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-green-800">About ProjSelector</h1>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Project Overview</h2>
                <p className="text-gray-700 mb-4">
                    ProjSelector is a tool designed to support software developers in the selection of open-source software (OSS).
                    It offers a robust search system based on OSS functionalities, enabling users to access detailed information
                    about development languages, licenses, dependencies, and similar projects, among others.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Use Cases and Target Audience</h2>
                <p className="text-gray-700 mb-4">
                    ProjSelector is especially useful for software developers who need to carefully evaluate various OSS options.
                    This tool is aimed at developers and other individuals interested in selecting the most suitable OSS for their projects.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Key Features</h2>
                <div className="bg-white p-5 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2">Search Functionality</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                        <li>Users can search by keywords, language, or license. With custom scoring, they can prioritize which aspect matters most in their search results.</li>
                        <li>Sort search results by relevance or name</li>
                        <li>Filter search results by license or language</li>
                    </ul>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Technical Background</h2>
                <div className="flex justify-start items-center space-x-8 mb-4">
                    <Image src="/nextjs-logo.svg" alt="Next.js" width={120} height={120} />
                    <Image src="/react-logo.svg" alt="React" width={120} height={120} />
                    <Image src="/typescript-logo.svg" alt="TypeScript" width={120} height={120} />
                    <Image src="/mongodb-logo.svg" alt="MongoDB" width={120} height={120} />
                    <Image src="/docker-logo.svg" alt="Docker" width={120} height={120} />
                    <Image src="/recoil-logo.svg" alt="Recoil" width={120} height={120} />
                </div>
                <div className="text-gray-700">
                    Currently, ProjSelector uses OSS package data provided by the official Ubuntu repository.
                    <Image src="/ubuntu-logo.svg" alt="Ubuntu" width={120} height={120} className="mt-2" />
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Future Plans</h2>
                <p className="text-gray-700">
                    ProjSelector aims to expand its data sources in the future to include other Linux distributions such as Debian and Fedora,
                    providing users with even more OSS options.
                </p>
            </section>
        </div>
    )
};

export default About;