import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DaySchedule } from './DaySchedule';
import { RainModeProvider } from '../contexts/RainModeContext';
import type { ScheduleItem } from '../data/schedule';
import { Plane } from 'lucide-react';

// Mock MapViewer to avoid rendering complex map logic
vi.mock('./map/MapViewer', () => ({
    MapViewer: () => <div data-testid="map-viewer">Map Component</div>
}));

describe('DaySchedule Component', () => {
    const mockSchedule: ScheduleItem[] = [
        {
            time: '10:00',
            title: 'Walking Tour',
            desc: ['Beautiful sunny walk'],
            highlight: true
        },
        {
            time: '12:00',
            title: 'Lunch',
            desc: ['Picnic outside'],
            highlight: false
        }
    ];

    it('renders schedule items with standard content', () => {
        render(
            <RainModeProvider>
                <DaySchedule
                    dayKey="day1"
                    title="Day 1"
                    icon={<Plane />}
                    schedule={mockSchedule}
                    isActive={true}
                />
            </RainModeProvider>
        );

        // Check basic rendering
        expect(screen.getByText('Walking Tour')).toBeInTheDocument();
        expect(screen.getByText('Beautiful sunny walk')).toBeInTheDocument();
        expect(screen.getByText('Lunch')).toBeInTheDocument();
    });

    it('renders map viewer component', () => {
        render(
            <RainModeProvider>
                <DaySchedule
                    dayKey="day1"
                    title="Day 1"
                    icon={<Plane />}
                    schedule={mockSchedule}
                    isActive={true}
                />
            </RainModeProvider>
        );

        expect(screen.getByTestId('map-viewer')).toBeInTheDocument();
    });
});
