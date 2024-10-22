"use client";

import React from "react";

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    setCurrentPage
}) => {
    const renderPageNumbers = () => {
        const pageNumbers = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        className={`px-2 py-1 mx-1 border ${currentPage === i ? 'bg-green-600 text-white' : ''}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // << < 1 ... currentPage-2 currentPage-1 currentPage currentPage+1 currentPage+2 ... total > >>
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            // << ボタン (最初のページに移動)
            if (currentPage > 1) {
                pageNumbers.push(
                    <button
                        key="first"
                        className="px-2 py-1 mx-1 border"
                        onClick={() => setCurrentPage(1)}
                    >
                        {'<<'}
                    </button>
                );
            }

            // < ボタン (前のページに移動)
            if (currentPage > 1) {
                pageNumbers.push(
                    <button
                        key="prev"
                        className="px-2 py-1 mx-1 border"
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        {'<'}
                    </button>
                );
            }

            // ページ番号の表示
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        className={`px-2 py-1 mx-1 border ${currentPage === i ? 'bg-green-600 text-white' : ''}`}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>
                );
            }

            // > ボタン (次のページに移動)
            if (currentPage < totalPages) {
                pageNumbers.push(
                    <button
                        key="next"
                        className="px-2 py-1 mx-1 border"
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        {'>'}
                    </button>
                );
            }

            // >> ボタン (最後のページに移動)
            if (currentPage < totalPages) {
                pageNumbers.push(
                    <button
                        key="last"
                        className="px-2 py-1 mx-1 border"
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        {'>>'}
                    </button>
                );
            }
        }

        return pageNumbers;
    }

    return (
        <div className="flex justify-center my-6">
            {renderPageNumbers()}
        </div>
    )
};

export default Pagination;