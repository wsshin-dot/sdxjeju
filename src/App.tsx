import { useState, useRef } from 'react';
import { RainModeProvider } from './contexts/RainModeContext';
import { Header } from './components/layout/Header';
import { Nav } from './components/layout/Nav';
import { IntroOverlay } from './components/common/IntroOverlay';
import { SwipeGuide } from './components/common/SwipeGuide';
import { DaySchedule } from './components/DaySchedule';
import { BudgetInfo } from './components/BudgetInfo';
import { GameCenter } from './components/games/GameCenter';
import { useBudget } from './hooks/useBudget';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SCHEDULE_DAY3 } from './data/schedule';

function AppContent() {
  const [activeTab, setActiveTab] = useState('info');
  const { config, calculation } = useBudget();

  // Swipe Logic
  const touchStart = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const minSwipeDistance = 80;
  const tabs = ['info', 'day1', 'day2', 'day3', 'rec'];

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

    // Check if horizontal swipe is dominant (more horizontal than vertical)
    if (Math.abs(distanceY) > Math.abs(distanceX)) return;

    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = tabs.indexOf(activeTab);
      if (isLeftSwipe && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (isRightSwipe && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };


  return (
    <div
      className="min-h-screen pb-safe-bottom"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <IntroOverlay />
      <SwipeGuide />
      <Header personCount={config.personCount} />
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="relative">
        <BudgetInfo isActive={activeTab === 'info'} />
        <DaySchedule
          dayKey="day1"
          title="2.5 (목) 오후: 출발"
          icon="✈️"
          schedule={SCHEDULE_DAY1}
          budgetData={calculation.day1}
          isActive={activeTab === 'day1'}
        />
        <DaySchedule
          dayKey="day2"
          title="2.6 (금) 즐거운 야외활동"
          icon="🏎️"
          schedule={SCHEDULE_DAY2}
          budgetData={calculation.day2}
          isActive={activeTab === 'day2'}
        />
        <DaySchedule
          dayKey="day3"
          title="2.7 (토) 해장 & 복귀"
          icon="🍜"
          schedule={SCHEDULE_DAY3}
          budgetData={calculation.day3}
          isActive={activeTab === 'day3'}
        />
        <GameCenter isActive={activeTab === 'rec'} />
      </main>

    </div >
  );
}

function App() {
  return (
    <RainModeProvider>
      <AppContent />
    </RainModeProvider>
  );
}

export default App;
