import { useState, useRef } from 'react';
import { RefreshCw, Users, Settings2 } from 'lucide-react';
import { GAME_PARTICIPANTS } from './participants';

// Mode 1: Fixed Drivers & Co-drivers
const FIXED_POOL = ['박범진', '손영길', '신예리', '임혜정', '조옥래', '홍예진'];

// Mode 2: Random (Drivers are fixed as Car 1/2 leaders for display, but others shuffle)
// Actually, original requirement was 8 passengers random (excluding 2 drivers).
const RANDOM_POOL = GAME_PARTICIPANTS.slice(2); // Skip 2 main drivers (Shin, Kim)

type GameMode = 'fixed' | 'random';

export function CarGame({ isActive }: { isActive: boolean }) {
    const [mode, setMode] = useState<GameMode>('fixed');
    
    // Seat state: 'fixed' uses 6 seats, 'random' uses 8 seats
    const [seats, setSeats] = useState<string[]>(Array(8).fill('')); 
    const [isShuffling, setIsShuffling] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Animation refs
    const intervalRefs = useRef<number[]>([]);

    const startShuffle = () => {
        if (isShuffling) return;
        setIsShuffling(true);
        setIsFinished(false);
        
        const count = mode === 'fixed' ? 6 : 8;
        const poolSource = mode === 'fixed' ? FIXED_POOL : RANDOM_POOL;
        
        setSeats(Array(8).fill('')); // Reset all

        // Fisher-Yates Shuffle
        const shuffled = [...poolSource];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const pool = [...poolSource];

        intervalRefs.current.forEach(clearInterval);
        intervalRefs.current = [];

        // 1. Start shuffling visual
        const newIntervals: number[] = [];
        for (let i = 0; i < count; i++) {
            const interval = window.setInterval(() => {
                setSeats(prev => {
                    const next = [...prev];
                    next[i] = pool[Math.floor(Math.random() * pool.length)];
                    return next;
                });
            }, 50 + Math.random() * 50);
            newIntervals.push(interval);
        }
        intervalRefs.current = newIntervals;

        // 2. Stop one by one
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (intervalRefs.current[i]) {
                    clearInterval(intervalRefs.current[i]);
                    setSeats(prev => {
                        const next = [...prev];
                        next[i] = shuffled[i];
                        return next;
                    });
                }

                if (i === count - 1) {
                    setIsShuffling(false);
                    setIsFinished(true);
                }
            }, 1000 + i * 400);
        }
    };

    if (!isActive) return null;

    // Helper for Fixed Seats
    const renderFixed = (name: string, role: string) => (
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-200 border-2 border-gray-300 h-20 transition-all hover:bg-gray-300">
            <span className="font-bold text-gray-700">{name}</span>
            <span className="text-[10px] text-gray-500">({role})</span>
        </div>
    );

    // Helper to render a random seat
    const renderSeat = (index: number) => (
        <div key={index} className={`
            flex items-center justify-center p-2 rounded-lg text-sm font-bold border transition-all h-20
            ${isFinished
                ? 'bg-white border-primary text-text-main shadow-sm scale-105'
                : 'bg-gray-100 border-transparent text-gray-400'}
        `}>
            {seats[index] || '?'}
        </div>
    );

    return (
        <div className="p-5 pb-24 animate-slide-up">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-2xl">🚗</span>
                    <h2 className="text-xl font-bold">차량 좌석 배치</h2>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
                        <button
                            onClick={() => { setMode('fixed'); setSeats([]); setIsFinished(false); }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                                mode === 'fixed' 
                                    ? 'bg-white text-primary shadow-sm' 
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Settings2 className="w-4 h-4" />
                            운전자 고정
                        </button>
                        <button
                            onClick={() => { setMode('random'); setSeats([]); setIsFinished(false); }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
                                mode === 'random' 
                                    ? 'bg-white text-secondary shadow-sm' 
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            완전 랜덤
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Car 1 */}
                    <div className="relative bg-gray-100 rounded-[30px] p-4 border-4 border-gray-300 shadow-xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-md z-10 whitespace-nowrap">
                            1호차 ({mode === 'fixed' ? '신우성/이재환' : '신우성'})
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {renderFixed('신우성', '운전')}
                                {mode === 'fixed' ? renderFixed('이재환', '보조') : renderSeat(0)}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {mode === 'fixed' ? (
                                    <>
                                        {renderSeat(0)}
                                        {renderSeat(1)}
                                        {renderSeat(2)}
                                    </>
                                ) : (
                                    <>
                                        {renderSeat(1)}
                                        {renderSeat(2)}
                                        {renderSeat(3)}
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Wheels */}
                        <div className="absolute -left-2 top-10 w-4 h-12 bg-black rounded-r-lg"></div>
                        <div className="absolute -right-2 top-10 w-4 h-12 bg-black rounded-l-lg"></div>
                        <div className="absolute -left-2 bottom-10 w-4 h-12 bg-black rounded-r-lg"></div>
                        <div className="absolute -right-2 bottom-10 w-4 h-12 bg-black rounded-l-lg"></div>
                    </div>

                    {/* Car 2 */}
                    <div className="relative bg-gray-100 rounded-[30px] p-4 border-4 border-gray-300 shadow-xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold shadow-md z-10 whitespace-nowrap">
                            2호차 ({mode === 'fixed' ? '김지섭/장민한' : '김지섭'})
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                {renderFixed('김지섭', '운전')}
                                {mode === 'fixed' ? renderFixed('장민한', '보조') : renderSeat(4)}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {mode === 'fixed' ? (
                                    <>
                                        {renderSeat(3)}
                                        {renderSeat(4)}
                                        {renderSeat(5)}
                                    </>
                                ) : (
                                    <>
                                        {renderSeat(5)}
                                        {renderSeat(6)}
                                        {renderSeat(7)}
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Wheels */}
                        <div className="absolute -left-2 top-10 w-4 h-12 bg-black rounded-r-lg"></div>
                        <div className="absolute -right-2 top-10 w-4 h-12 bg-black rounded-l-lg"></div>
                        <div className="absolute -left-2 bottom-10 w-4 h-12 bg-black rounded-r-lg"></div>
                        <div className="absolute -right-2 bottom-10 w-4 h-12 bg-black rounded-l-lg"></div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        onClick={startShuffle}
                        disabled={isShuffling}
                        className={`w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 bg-gradient-to-r ${
                            mode === 'fixed' ? 'from-primary to-orange-600' : 'from-secondary to-blue-600'
                        }`}
                    >
                        {isShuffling ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" /> 운명 결정 중...
                            </>
                        ) : (
                            mode === 'fixed' ? '🎲 뒷좌석 룰렛 돌리기' : '🎲 완전 랜덤 룰렛 돌리기'
                        )}
                    </button>
                    {!isFinished && <p className="mt-4 text-sm text-gray-400">
                        {mode === 'fixed' ? '앞자리는 고정입니다.' : '운전자를 제외한 전원 랜덤 배치입니다.'}
                    </p>}
                </div>
            </div>
        </div>
    );
}
