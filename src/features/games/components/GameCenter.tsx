import { useState } from 'react';
import { MarbleRace } from './MarbleRace';
import { CarGame } from './CarGame';
import { StockCounter } from './StockCounter';

export function GameCenter({ isActive }: { isActive: boolean }) {
    const [activeGame, setActiveGame] = useState<'marble' | 'car' | 'stock'>('marble');

    return (
        <div className={`${isActive ? 'block' : 'hidden'}`}>
            {/* Header / Toggle */}
            <div className="bg-white/90 backdrop-blur-md sticky top-[60px] z-40 border-b border-border shadow-sm p-3 flex gap-2 justify-center overflow-x-auto">
                <button
                    onClick={() => setActiveGame('marble')}
                    className={`flex-none w-[100px] py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeGame === 'marble' ? 'bg-primary text-white shadow-md transform scale-105' : 'bg-gray-100 text-text-sub hover:bg-gray-200'}`}
                >
                    🎱 순서
                </button>
                <button
                    onClick={() => setActiveGame('car')}
                    className={`flex-none w-[100px] py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeGame === 'car' ? 'bg-secondary text-white shadow-md transform scale-105' : 'bg-gray-100 text-text-sub hover:bg-gray-200'}`}
                >
                    🚗 차량
                </button>
                <button
                    onClick={() => setActiveGame('stock')}
                    className={`flex-none w-[100px] py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeGame === 'stock' ? 'bg-red-500 text-white shadow-md transform scale-105' : 'bg-gray-100 text-text-sub hover:bg-gray-200'}`}
                >
                    📈 주무새
                </button>
            </div>

            <div className="pt-4">
                <MarbleRace isActive={activeGame === 'marble'} />
                <CarGame isActive={activeGame === 'car'} />
                <StockCounter isActive={activeGame === 'stock'} />
            </div>
        </div>
    );
}
