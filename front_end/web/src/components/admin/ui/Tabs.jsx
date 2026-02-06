import { useState } from 'react';

/**
 * Tabs Component - Tab navigation
 * @param {Array} tabs - Array of { id, label, icon? }
 * @param {string} defaultTab - Default active tab id
 * @param {function} onChange - Tab change handler
 */
export default function Tabs({
    tabs = [],
    defaultTab,
    onChange,
    variant = 'underline',
    className = '',
}) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const variants = {
        underline: {
            container: 'border-b border-gray-200',
            tab: 'px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
            active: 'text-primary border-primary',
            inactive: 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300',
        },
        pills: {
            container: 'bg-gray-100 p-1 rounded-lg',
            tab: 'px-4 py-2 text-sm font-medium rounded-md transition-all',
            active: 'bg-white text-primary shadow-sm',
            inactive: 'text-gray-600 hover:text-gray-900',
        },
    };

    const v = variants[variant];

    return (
        <div className={`flex gap-1 ${v.container} ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`
            ${v.tab}
            ${activeTab === tab.id ? v.active : v.inactive}
            flex items-center gap-2
          `}
                >
                    {tab.icon && <span className="material-symbols-outlined text-lg">{tab.icon}</span>}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
