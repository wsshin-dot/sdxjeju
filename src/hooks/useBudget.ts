import { useState, useEffect, useMemo } from 'react';
import { supabase, TABLE_NAME } from '../lib/supabase';
import type { BudgetConfig, BudgetCalculation, BudgetCosts } from '../types';

const INITIAL_CONFIG: BudgetConfig = {
    totalBudget: 3500000,
    personCount: 10,
    totalBudgetPerPerson: 350000,
    costs: {
        flight: 100000,
        rent: 40000,
        day1Dinner: 50000,
        whiskey: 20000,
        day2Lunch: 24000,
        park981: 37000,
        day2Cafe: 8000,
        day2Dinner: 40000,
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
        const customTotal = c.customTotal || 0;

        // Sum custom items if they exist and are confirmed
        const calculatedCustomTotal = c.customItems
            ? c.customItems.reduce((sum, item) => item.confirmed ? sum + item.value : sum, 0)
            : customTotal;

        const day1 = c.flight + c.rent + c.day1Dinner + c.whiskey;
        const day2 = c.day2Lunch + c.park981 + c.day2Cafe + c.day2Dinner;
        const day3 = calculatedCustomTotal; // Custom items shown in generic logic or specifically

        // In the original script, day3 cost was basically just customTotal? 
        // "const day3 = customTotal; // 커스텀 항목은 Day3에 표시"

        const total = day1 + day2 + day3;
        const remaining = config.totalBudgetPerPerson - total;

        return {
            day1: { cost: day1, cumulative: day1, remaining: config.totalBudgetPerPerson - day1 },
            day2: { cost: day2, cumulative: day1 + day2, remaining: config.totalBudgetPerPerson - day1 - day2 },
            day3: { cost: day3, cumulative: total, remaining: remaining },
            total,
            remaining
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
                    let newConfig = { ...INITIAL_CONFIG };

                    if (remoteData.costs) {
                        // Load meta if exists
                        if (remoteData.costs._meta) {
                            newConfig.totalBudget = remoteData.costs._meta.totalBudget;
                            newConfig.personCount = remoteData.costs._meta.personCount;
                            newConfig.totalBudgetPerPerson = Math.floor(newConfig.totalBudget / newConfig.personCount);
                        } else if (remoteData.total_budget_per_person) {
                            newConfig.totalBudgetPerPerson = remoteData.total_budget_per_person;
                            newConfig.totalBudget = newConfig.totalBudgetPerPerson * newConfig.personCount;
                        }

                        // Merge costs
                        newConfig.costs = { ...newConfig.costs, ...remoteData.costs };
                    }
                    setConfig(newConfig);
                }
            } catch (err: any) {
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

            const payload = {
                total_budget_per_person: config.totalBudgetPerPerson,
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
        } catch (err: any) {
            console.error('Failed to save budget', err);
            setError(err.message);
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

    return { config, setConfig, calculation, loading, error, saving, saveBudget, updateCost };
}
