/**
 * Pagination Component
 * @param {number} currentPage - Current page (1-indexed)
 * @param {number} totalPages - Total pages
 * @param {function} onPageChange - Page change handler
 */
export default function Pagination({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    className = '',
}) {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5;
        let start = Math.max(1, currentPage - Math.floor(showPages / 2));
        let end = Math.min(totalPages, start + showPages - 1);

        if (end - start + 1 < showPages) {
            start = Math.max(1, end - showPages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            {/* Previous */}
            <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>

            {/* Page numbers */}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={`
            w-10 h-10 rounded-lg text-sm font-medium transition-colors
            ${currentPage === page
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }
          `}
                >
                    {page}
                </button>
            ))}

            {/* Next */}
            <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
        </div>
    );
}
