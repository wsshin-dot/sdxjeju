import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, TABLE_NAME } from '../../../lib/supabase';
import type { BudgetConfig, BudgetCalculation, BudgetCosts } from '../../../types';

const INITIAL_CONFIG: BudgetConfig = {
    totalBudget: 3500000,
    personCount: 10,
    totalBudgetPerPerson: 350000,
    costs: {
        flight: 1000000,
        rent: 400000,
        gas: 150000,
        day1Dinner: 500000,
        day1Groceries: 150000,
        whiskey: 200000,
        day2Lunch: 240000,
        park981: 370000,
        day2Cafe: 80000,
        day2Dinner: 400000,
        customTotal: 0,
        customItems: []
    }
};

interface BudgetContextType {
    config: BudgetConfig;
    setConfig: React.Dispatch<React.SetStateAction<BudgetConfig>>;
    calculation: BudgetCalculation;
    loading: boolean;
    error: string | null;
    saving: boolean;
    saveBudget: () => Promise<boolean>;
    deleteBudget: () => Promise<boolean>;
    updateCost: (key: keyof BudgetCosts, value: number) => void;
    addCustomItem: () => void;
    updateCustomItem: (index: number, field: keyof { label: string, value: number, confirmed: boolean, executed?: boolean }, value: string | number | boolean) => void;
    removeCustomItem: (index: number) => void;
    updateConfigValue: (key: keyof BudgetConfig, value: number) => void;
    updateStatus: (key: keyof BudgetCosts, executed: boolean) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
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
                        if (remoteData.costs._meta) {
                            newConfig.totalBudget = remoteData.costs._meta.totalBudget;
                            newConfig.personCount = remoteData.costs._meta.personCount;
                            newConfig.totalBudgetPerPerson = Math.floor(newConfig.totalBudget / newConfig.personCount);
                        } else if (remoteData.total_budget_per_person) {
                            newConfig.totalBudgetPerPerson = remoteData.total_budget_per_person;
                            newConfig.totalBudget = newConfig.totalBudgetPerPerson * newConfig.personCount;
                        }
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

    const saveBudget = async () => {
        try {
            setSaving(true);
            setError(null);
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
            const { error } = await supabase.from(TABLE_NAME).upsert({ id: 1, ...payload });
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

    const deleteBudget = async () => {
        try {
            setSaving(true);
            setError(null);
            const { error } = await supabase.from(TABLE_NAME).delete().eq('id', 1);
            if (error) throw error;
            setConfig(INITIAL_CONFIG);
            return true;
        } catch (err: unknown) {
            console.error('Failed to delete budget', err);
            setError(err instanceof Error ? err.message : String(err));
            return false;
        } finally {
            setSaving(false);
        }
    };

    const updateCost = (key: keyof BudgetCosts, value: number) => {
        setConfig(prev => ({ ...prev, costs: { ...prev.costs, [key]: value } }));
    };

    const addCustomItem = () => {
        setConfig(prev => ({
            ...prev,
            costs: { ...prev.costs, customItems: [...(prev.costs.customItems || []), { label: '', value: 0, confirmed: false }] }
        }));
    };

    const updateCustomItem = (index: number, field: any, value: any) => {
        setConfig(prev => {
            const newItems = [...(prev.costs.customItems || [])];
            if (newItems[index]) newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, costs: { ...prev.costs, customItems: newItems } };
        });
    };

    const removeCustomItem = (index: number) => {
        setConfig(prev => {
            const newItems = [...(prev.costs.customItems || [])];
            newItems.splice(index, 1);
            return { ...prev, costs: { ...prev.costs, customItems: newItems } };
        });
    };

    const updateConfigValue = (key: keyof BudgetConfig, value: number) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const updateStatus = (key: keyof BudgetCosts, executed: boolean) => {
        setConfig(prev => ({
            ...prev,
            costs: {
                ...prev.costs,
                executionStatus: { ...(prev.costs.executionStatus || {}), [key]: executed }
            }
        }));
    };

    return (
        <BudgetContext.Provider value={{
            config, setConfig, calculation, loading, error, saving,
            saveBudget, deleteBudget, updateCost, addCustomItem, updateCustomItem,
            removeCustomItem, updateConfigValue, updateStatus
        }}>
            {children}
        </BudgetContext.Provider>
    );
}

export function useBudget() {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
}
