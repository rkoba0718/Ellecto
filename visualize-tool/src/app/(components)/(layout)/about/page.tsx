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
                    ProjSelector is a tool designed to support both software developers and users in the selection of open-source software (OSS).
                    It offers a robust search system based on OSS functionalities, enabling users to access detailed information
                    about development languages, licenses, dependencies, development history, and similar projects, among others.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Use Cases and Target Audience</h2>
                <p className="text-gray-700 mb-4">
                    ProjSelector is especially useful for software developers who need to carefully evaluate various OSS options.
                    Additionally, software users who want to identify suitable software for their needs can benefit from ProjSelector's detailed search and filtering features. 
                    Whether you are a developer building new software or a user looking for reliable OSS solutions, ProjSelector helps streamline the selection process.
                </p>
            </section>

            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 text-green-700">Key Features</h2>
                <div className="bg-white p-5 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-2">Search Functionality</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                        <li>Users can search by keywords, language, license, development history, last update period, or number of dependencies.</li>
                        <li>Custom scoring allows users to prioritize search results based on what matters most, such as keywords, language, or license.</li>
                    </ul>
                    <h3 className="text-xl font-semibold mb-2">Filtering and Sorting</h3>
                    <ul className="list-disc pl-5 mb-4 text-gray-700">
                        <li>Filter search results by license or language.</li>
                        <li>Sort results by relevance, name, development history (longest first), last update (most recent first), or dependencies count (fewest first).</li>
                    </ul>
                    <h3 className="text-xl font-semibold mb-2">Additional Insights</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                        <li>View development timelines and update frequencies to evaluate software longevity and maintenance activity.</li>
                        <li>Compare projects based on dependencies to identify lightweight and maintainable software.</li>
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