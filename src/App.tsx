import { useState } from 'react';
import { RainModeProvider } from './features/weather/contexts/RainModeContext';
import { Header } from './components/layout/Header';
import { Nav } from './components/layout/Nav';
import { IntroOverlay } from './components/common/IntroOverlay';
import { SwipeGuide } from './components/common/SwipeGuide';
import { DaySchedule } from './features/schedule/components/DaySchedule';
import { BudgetInfo } from './features/budget/components/BudgetInfo';
import { GameCenter } from './features/games/components/GameCenter';
import { useBudget } from './features/budget/hooks/useBudget';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SCHEDULE_DAY3 } from './features/schedule/data/schedule';
import { useSwipeTabs } from './hooks/useSwipeTabs';

function AppContent() {
  const [activeTab, setActiveTab] = useState('info');
  const { config, calculation } = useBudget();
  const tabs = ['info', 'day1', 'day2', 'day3', 'rec'];

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipeTabs({
    tabs,
    activeTab,
    onTabChange: setActiveTab
  });

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
