import { useState, useEffect, useMemo } from 'react';
import { supabase, TABLE_NAME } from '../../../lib/supabase';
import type { BudgetConfig, BudgetCalculation, BudgetCosts } from '../../../types';

const INITIAL_CONFIG: BudgetConfig = {
    totalBudget: 3500000,
    personCount: 10, // 2 drivers + 8 passengers
    totalBudgetPerPerson: 350000,
    costs: {
        flight: 1000000, // 100k * 10
        rent: 400000,    // 40k * 10
        gas: 150000,     // Total estimate
        day1Dinner: 500000, // 50k * 10
        day1Groceries: 150000, // 15k * 10
        whiskey: 200000, // 20k * 10
        day2Lunch: 240000, // 24k * 10
        park981: 370000, // 37k * 10
        day2Cafe: 80000, // 8k * 10
        day2Dinner: 400000, // 40k * 10
        customTotal: 0,
        customItems: []
    }
};

export function useBudget() {
    const [config, setConfig] = useState<BudgetConfig>(INITIAL_CONFIG);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Calculate budgets derived from config
    const calculation = useMemo<BudgetCalculation>(() => {
        const c = config.costs;
        const status = c.executionStatus || {};
        const customTotal = c.customTotal || 0;

        // Sum custom items if they exist and are confirmed
        const calculatedCustomTotal = c.customItems
            ? c.customItems.reduce((sum, item) => item.confirmed ? sum + item.value : sum, 0)
            : customTotal;

        const day1 = c.flight + c.rent + c.gas + c.day1Dinner + c.day1Groceries + c.whiskey;
        const day2 = c.day2Lunch + c.park981 + c.day2Cafe + c.day2Dinner;
        const day3 = calculatedCustomTotal;

        const total = day1 + day2 + day3;
        // CHANGED: Use totalBudget for remaining calculation
        const remaining = config.totalBudget - total;

        // Calculate Spent vs Planned
        let totalSpent = 0;
        let totalPlanned = 0;

        // Standard Items
        const standardKeys = ['flight', 'rent', 'gas', 'day1Dinner', 'day1Groceries', 'whiskey', 'day2Lunch', 'park981', 'day2Cafe', 'day2Dinner'];
        standardKeys.forEach(key => {
            const val = (c[key] as number) || 0;
            if (status[key]) {
                totalSpent += val;
            } else {
                totalPlanned += val;
            }
        });

        // Custom Items
        if (c.customItems) {
            c.customItems.forEach(item => {
                if (item.confirmed) {
                    if (item.executed) {
                        totalSpent += item.value;
                    } else {
                        totalPlanned += item.value;
                    }
                }
            });
        }

        // Real Remaining (Total Budget - Spent)
        const realRemaining = config.totalBudget - totalSpent;

        return {
            day1: { cost: day1, cumulative: day1, remaining: config.totalBudget - day1 },
            day2: { cost: day2, cumulative: day1 + day2, remaining: config.totalBudget - day1 - day2 },
            day3: { cost: day3, cumulative: total, remaining: remaining },
            total,
            remaining,
            totalSpent,
            totalPlanned,
            realRemaining
        };
    }, [config]);

    // Load from DB
    useEffect(() => {
        async function loadBudget() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from(TABLE_NAME)
                    .select('*')
                    .order('updated_at', { ascending: false })
                    .limit(1);

                if (error) throw error;

                if (data && data.length > 0) {
                    const remoteData = data[0];
                    const newConfig = { ...INITIAL_CONFIG };

                    if (remoteData.costs) {
                        // Load meta if exists
                        if (remoteData.costs._meta) {
                            newConfig.totalBudget = remoteData.costs._meta.totalBudget;
                            newConfig.personCount = remoteData.costs._meta.personCount;
                            newConfig.totalBudgetPerPerson = Math.floor(newConfig.totalBudget / newConfig.personCount);
                        } else if (remoteData.total_budget_per_person) {
                            // Legacy fallback
                            newConfig.totalBudgetPerPerson = remoteData.total_budget_per_person;
                            newConfig.totalBudget = newConfig.totalBudgetPerPerson * newConfig.personCount;
                        }

                        // Merge costs
                        newConfig.costs = { ...newConfig.costs, ...remoteData.costs };
                    }
                    setConfig(newConfig);
                }
            } catch (err: unknown) {
                console.error('Failed to load budget', err);
                setError('Failed to load budget from DB');
            } finally {
                setLoading(false);
            }
        }

        loadBudget();
    }, []);

    // Save to DB
    const saveBudget = async () => {
        try {
            setSaving(true);
            setError(null);

            // Ensure per-person is synced
            const derivedPerPerson = Math.floor(config.totalBudget / config.personCount);

            const payload = {
                total_budget_per_person: derivedPerPerson,
                costs: {
                    ...config.costs,
                    _meta: {
                        totalBudget: config.totalBudget,
                        personCount: config.personCount
                    }
                },
                updated_at: new Date().toISOString()
            };

            // Try UPDATE (PATCH equivalent usually means UPDATE where id=1)
            // Supabase generic 'upsert' or update
            // Original script used PATCH then POST

            // We'll try upsert with a fixed ID if we knew it, but here we just likely insert a new one or update latest?
            // The original script fetched param ?id=eq.1 for PATCH. So it assumed Row ID 1.

            const { error } = await supabase
                .from(TABLE_NAME)
                .upsert({ id: 1, ...payload });

            if (error) throw error;
            return true;
        } catch (err: unknown) {
            console.error('Failed to save budget', err);
            setError(err instanceof Error ? err.message : String(err));
            return false;
        } finally {
            setSaving(false);
        }
    };

    const updateCost = (key: keyof BudgetCosts, value: number) => {
        setConfig(prev => ({
            ...prev,
            costs: {
                ...prev.costs,
                [key]: value
            }
        }));
    };

    const addCustomItem = () => {
        setConfig(prev => ({
            ...prev,
            costs: {
                ...prev.costs,
                customItems: [
                    ...(prev.costs.customItems || []),
                    { label: '', value: 0, confirmed: false }
                ]
            }
        }));
    };

    const updateCustomItem = (index: number, field: keyof { label: string, value: number, confirmed: boolean, executed?: boolean }, value: string | number | boolean) => {
        setConfig(prev => {
            const newItems = [...(prev.costs.customItems || [])];
            if (newItems[index]) {
                newItems[index] = { ...newItems[index], [field]: value };
            }
            return {
                ...prev,
                costs: {
                    ...prev.costs,
                    customItems: newItems
                }
            };
        });
    };

    const updateConfigValue = (key: keyof BudgetConfig, value: number) => {
        setConfig(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const updateStatus = (key: keyof BudgetCosts, executed: boolean) => {
        setConfig(prev => ({
            ...prev,
            costs: {
                ...prev.costs,
                executionStatus: {
                    ...(prev.costs.executionStatus || {}),
                    [key]: executed
                }
            }
        }));
    };

    const removeCustomItem = (index: number) => {
        setConfig(prev => {
            const newItems = [...(prev.costs.customItems || [])];
            newItems.splice(index, 1);
            return {
                ...prev,
                costs: {
                    ...prev.costs,
                    customItems: newItems
                }
            };
        });
    };

    return {
        config,
        setConfig,
        calculation,
        loading,
        error,
        saving,
        saveBudget,
        updateCost,
        addCustomItem,
        updateCustomItem,
        removeCustomItem,
        updateConfigValue,
        updateStatus
    };
}
