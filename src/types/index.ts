export interface BudgetCosts {
    flight: number;
    rent: number;
    day1Dinner: number;
    day1Groceries: number;
    whiskey: number;
    day2Lunch: number;
    park981: number;
    day2Cafe: number;
    day2Dinner: number;
    customTotal?: number; // For custom added items
    customItems?: CustomItem[];
    // Execution Status Map (key: costKey, value: boolean)
    executionStatus?: Record<string, boolean>;
    _meta?: {
        totalBudget: number;
        personCount: number;
    };
    [key: string]: number | CustomItem[] | Record<string, boolean> | { totalBudget: number; personCount: number } | undefined; // Allow dynamic access restricted to known types
}

export interface CustomItem {
    label: string;
    value: number;
    confirmed: boolean;
    executed?: boolean; // Custom item execution status
}

export interface BudgetConfig {
    totalBudget: number;
    personCount: number;
    totalBudgetPerPerson: number;
    costs: BudgetCosts;
}

export interface DayBudget {
    cost: number;
    cumulative: number;
    remaining: number;
}

export interface BudgetCalculation {
    day1: DayBudget;
    day2: DayBudget;
    day3: DayBudget;
    total: number;
    remaining: number;
    // New fields
    totalSpent: number;   // 집행 완료 총액
    totalPlanned: number; // 집행 예정 총액
    realRemaining: number; // 총 예산 - 집행 완료 (실제 남은 돈)
}
