interface NavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function Nav({ activeTab, onTabChange }: NavProps) {
    const tabs = [
        { id: 'info', label: 'Info', sub: '정보/예산' },
        { id: 'day1', label: 'Day 1', sub: '2.5 (목)' },
        { id: 'day2', label: 'Day 2', sub: '2.6 (금)' },
        { id: 'day3', label: 'Day 3', sub: '2.7 (토)' },
        { id: 'rec', label: 'REC', sub: '게임' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-2 py-3 border-b border-black/5 flex justify-between items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
            flex-1 min-w-0 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all duration-300 relative overflow-hidden
            ${activeTab === tab.id
                            ? 'bg-white text-primary shadow-sm'
                            : 'bg-transparent text-text-sub hover:bg-gray-50'}
          `}
                >
                    <span className="text-sm font-bold leading-tight">{tab.label}</span>
                    <span className="text-[10px] font-normal opacity-80">{tab.sub}</span>

                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 w-[40%] h-1 bg-primary rounded-t-full" />
                    )}
                </button>
            ))}
        </nav>
    );
}
