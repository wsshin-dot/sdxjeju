
import { useEffect, useState } from 'react';

export function SwipeGuide() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show after 1.5s
        const timer = setTimeout(() => {
            setVisible(true);
            // Hide after 4.5s (3s valid time)
            setTimeout(() => setVisible(false), 3000);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full z-40 pointer-events-none flex items-center gap-2 animate-fade-in-out">
            <span className="text-xl">👆</span>
            <span className="text-sm font-medium">좌우로 밀어서 일정 확인</span>
        </div>
    );
}
