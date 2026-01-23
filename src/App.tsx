import { useState } from 'react';
import { RainModeProvider } from './contexts/RainModeContext';
import { Header } from './components/layout/Header';
import { Nav } from './components/layout/Nav';
import { IntroOverlay } from './components/common/IntroOverlay';
import { DaySchedule } from './components/DaySchedule';
import { BudgetInfo } from './components/BudgetInfo';
import { MarbleRace } from './components/MarbleRace';
import { useBudget } from './hooks/useBudget';
import { SCHEDULE_DAY1, SCHEDULE_DAY2, SCHEDULE_DAY3 } from './data/schedule';

function AppContent() {
  const [activeTab, setActiveTab] = useState('info');
  const { config, calculation } = useBudget(); // Global budget context would be better but prop drilling is fine for this size

  // Create a map for custom item configs if needed
  // For now just passing basics

  return (
    <div className="min-h-screen pb-safe-bottom">
      <IntroOverlay />
      <Header personCount={config.personCount} />

      <main className="relative">
        {/* Render ALL tabs to keep state/maps alive, but toggle visibility */}
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
        <MarbleRace isActive={activeTab === 'rec'} />
      </main>

      <Nav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
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
