"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    return (
        <header className="bg-green-700 text-white shadow-md">
            <nav className="container mx-auto py-2 flex justify-between items-center">
                <div className="text-lg font-bold">
                    <a href="/" className="hover:text-gray-200">ProjSelector</a>
                </div>

                <div>
                    <a href="/about" className="hover:text-gray-200 pr-2.5">
                        <FontAwesomeIcon icon={faInfoCircle} className="pr-1" />
                        About
                    </a>
                    <a href="/add" className="hover:text-gray-200">
                        <FontAwesomeIcon icon={faPlusCircle} className="pr-1" />
                        Add
                    </a>
                </div>
            </nav>
        </header>
    )
}