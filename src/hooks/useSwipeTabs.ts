import { useRef } from 'react';

interface UseSwipeTabsProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    minSwipeDistance?: number;
}

export function useSwipeTabs({ tabs, activeTab, onTabChange, minSwipeDistance = 80 }: UseSwipeTabsProps) {
    const touchStart = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEnd = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        touchEnd.current = null;
        touchEndY.current = null;
        touchStart.current = e.targetTouches[0].clientX;
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEnd.current = e.targetTouches[0].clientX;
        touchEndY.current = e.targetTouches[0].clientY;
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current || !touchStartY.current || !touchEndY.current) return;

        const distanceX = touchStart.current - touchEnd.current;
        const distanceY = touchStartY.current - touchEndY.current;

        // Check if horizontal swipe is dominant
        if (Math.abs(distanceY) > Math.abs(distanceX)) return;

        const isLeftSwipe = distanceX > minSwipeDistance;
        const isRightSwipe = distanceX < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            const currentIndex = tabs.indexOf(activeTab);
            if (isLeftSwipe && currentIndex < tabs.length - 1) {
                onTabChange(tabs[currentIndex + 1]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            if (isRightSwipe && currentIndex > 0) {
                onTabChange(tabs[currentIndex - 1]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    return { onTouchStart, onTouchMove, onTouchEnd };
}
