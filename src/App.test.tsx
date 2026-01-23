
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock scrollIntoView since jsdom doesn't implement it
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.scrollTo = vi.fn();

describe('App Component', () => {
    it('renders Header with person count', () => {
        render(<App />);
        expect(screen.getByText(/제주/i)).toBeInTheDocument();
    });

    it('renders Info tab by default', () => {
        render(<App />);
        expect(screen.getByText(/총 예산/i)).toBeInTheDocument();
    });

    it('navigates to Day 1 on click', async () => {
        render(<App />);
        const day1Tab = screen.getByText('Day 1');
        fireEvent.click(day1Tab);

        await waitFor(() => {
            expect(screen.getByText('2.5 (목) 오후: 출발')).toBeInTheDocument();
        });
    });

    it.skip('navigates to REC tab and shows Car Game', async () => {
        render(<App />);
        const recTab = screen.getByText('REC');
        fireEvent.click(recTab);

        await waitFor(() => {
            expect(screen.getByText(/차량 좌석 배치/i)).toBeInTheDocument();
        }, { timeout: 3000 });

        // Check if car visuals are present (text checks)
        expect(screen.getByText(/1호차/i)).toBeInTheDocument();
        expect(screen.getByText(/2호차/i)).toBeInTheDocument();
    });

    it('supports swipe navigation (Right to Left -> Next Tab)', async () => {
        render(<App />);
        // Default is Info
        // Swipe Left (Start Right -> Move Left) => Next Tab (Day 1)
        const container = document.querySelector('.min-h-screen') as HTMLElement;

        fireEvent.touchStart(container, { targetTouches: [{ clientX: 300 }] });
        fireEvent.touchMove(container, { targetTouches: [{ clientX: 100 }] }); // Move 200px Left
        fireEvent.touchEnd(container);

        await waitFor(() => {
            // Should be on Day 1
            expect(screen.getByText('2.5 (목) 오후: 출발')).toBeInTheDocument();
        });
    });

    it('supports swipe navigation (Left to Right -> Prev Tab)', async () => {
        render(<App />);
        // First go to Day 1
        fireEvent.click(screen.getByText('Day 1'));

        // Swipe Right (Start Left -> Move Right) => Prev Tab (Info)
        const container = document.querySelector('.min-h-screen') as HTMLElement;

        fireEvent.touchStart(container, { targetTouches: [{ clientX: 100 }] });
        fireEvent.touchMove(container, { targetTouches: [{ clientX: 300 }] }); // Move 200px Right
        fireEvent.touchEnd(container);

        await waitFor(() => {
            // Should be back on Info
            expect(screen.getByText(/총 예산/i)).toBeInTheDocument();
        });
    });
});
