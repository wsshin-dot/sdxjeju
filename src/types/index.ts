export interface BudgetCosts {
    flight: number;
    rent: number;
    day1Dinner: number;
    whiskey: number;
    day2Lunch: number;
    park981: number;
    day2Cafe: number;
    day2Dinner: number;
    customTotal?: number; // For custom added items
    customItems?: CustomItem[];
    _meta?: {
        totalBudget: number;
        personCount: number;
    };
    [key: string]: any; // Allow dynamic access
}

export interface CustomItem {
    label: string;
    value: number;
    confirmed: boolean;
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
}
