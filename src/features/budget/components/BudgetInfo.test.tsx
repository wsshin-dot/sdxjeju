import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BudgetInfo } from './BudgetInfo';

// Mock the useBudget hook
vi.mock('../hooks/useBudget', () => ({
    useBudget: () => ({
        config: {
            totalBudget: 3500000,
            personCount: 10,
            costs: {
                flight: 100000,
                rent: 40000,
                day1Dinner: 50000,
                whiskey: 20000,
                day2Lunch: 24000,
                park981: 37000,
                day2Cafe: 8000,
                day2Dinner: 40000,
                customItems: []
            }
        },
        calculation: {
            day1: { cost: 210000, cumulative: 210000, remaining: 140000 },
            day2: { cost: 109000, cumulative: 319000, remaining: 31000 },
            day3: { cost: 0, cumulative: 319000, remaining: 31000 },
            total: 319000,
            remaining: 31000
        },
        saveBudget: vi.fn(),
        saving: false,
        updateCost: vi.fn(),
        addCustomItem: vi.fn(),
        updateCustomItem: vi.fn(),
        removeCustomItem: vi.fn(),
        updateConfigValue: vi.fn()
    })
}));

describe('BudgetInfo Component', () => {
    it('renders budget calculator section', () => {
        render(<BudgetInfo isActive={true} />);

        // Check for key budget elements
        expect(screen.getByText(/총 예산/i)).toBeInTheDocument();
        expect(screen.getByText(/예산 계산기/i)).toBeInTheDocument();
    });

    it('renders unlock button', () => {
        render(<BudgetInfo isActive={true} />);

        // Check unlock button exists
        expect(screen.getByText(/잠금해제/i)).toBeInTheDocument();
    });

    it('renders fixed budget items', () => {
        render(<BudgetInfo isActive={true} />);

        // Check for standard budget items
        expect(screen.getByText('항공권')).toBeInTheDocument();
        expect(screen.getByText('렌트+기름')).toBeInTheDocument();
    });
});
