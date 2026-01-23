import { useState } from 'react';
import { MarbleRace } from './MarbleRace';
import { CarGame } from './CarGame';

export function GameCenter({ isActive }: { isActive: boolean }) {
    const [activeGame, setActiveGame] = useState<'marble' | 'car'>('marble');

    return (
        <div className={`${isActive ? 'block' : 'hidden'}`}>
            {/* Header / Toggle */}
            <div className="bg-white/90 backdrop-blur-md sticky top-[60px] z-40 border-b border-border shadow-sm p-3 flex gap-2 justify-center">
                <button
                    onClick={() => setActiveGame('marble')}
                    className={`flex-1 max-w-[150px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeGame === 'marble' ? 'bg-primary text-white shadow-md transform scale-105' : 'bg-gray-100 text-text-sub hover:bg-gray-200'}`}
                >
                    🎱 순서 정하기
                </button>
                <button
                    onClick={() => setActiveGame('car')}
                    className={`flex-1 max-w-[150px] py-2.5 rounded-xl font-bold text-sm transition-all ${activeGame === 'car' ? 'bg-secondary text-white shadow-md transform scale-105' : 'bg-gray-100 text-text-sub hover:bg-gray-200'}`}
                >
                    🚗 차량 배정
                </button>
            </div>

            <div className="pt-4">
                <MarbleRace isActive={activeGame === 'marble'} />
                <CarGame isActive={activeGame === 'car'} />
            </div>
        </div>
    );
}
