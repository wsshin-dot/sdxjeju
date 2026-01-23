import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface RainModeContextType {
    isRainy: boolean;
    toggleRainMode: () => void;
}

const RainModeContext = createContext<RainModeContextType | undefined>(undefined);

export function RainModeProvider({ children }: { children: ReactNode }) {
    const [isRainy, setIsRainy] = useState(false);

    const toggleRainMode = () => {
        setIsRainy(prev => !prev);
        // Optional: Toast notification logic here if needed, or in component
    };

    return (
        <RainModeContext.Provider value={{ isRainy, toggleRainMode }}>
            {children}
        </RainModeContext.Provider>
    );
}

export function useRainMode() {
    const context = useContext(RainModeContext);
    if (context === undefined) {
        throw new Error('useRainMode must be used within a RainModeProvider');
    }
    return context;
}
