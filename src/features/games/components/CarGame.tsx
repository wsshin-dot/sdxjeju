import { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

// Drivers & Co-drivers (Fixed)
// Car 1: 신우성 (Driver), 이재환 (Co-driver)
// Car 2: 김지섭 (Driver), 장민한 (Co-driver)

// Random Pool (6 people)
const RANDOM_POOL = ['박범진', '손영길', '신예리', '임혜정', '조옥래', '홍예진'];

export function CarGame({ isActive }: { isActive: boolean }) {
    // We only shuffle 6 seats (3 per car back row)
    const [seats, setSeats] = useState<string[]>(Array(6).fill(''));
    const [isShuffling, setIsShuffling] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Animation refs
    const intervalRefs = useRef<number[]>([]);

    const startShuffle = () => {
        if (isShuffling) return;
        setIsShuffling(true);
        setIsFinished(false);
        setSeats(Array(6).fill(''));

        // Fisher-Yates Shuffle
        const shuffled = [...RANDOM_POOL];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const pool = [...RANDOM_POOL];

        intervalRefs.current.forEach(clearInterval);
        intervalRefs.current = [];

        // 1. Start shuffling visual
        const newIntervals: number[] = [];
        for (let i = 0; i < 6; i++) {
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
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                if (intervalRefs.current[i]) {
                    clearInterval(intervalRefs.current[i]);
                    setSeats(prev => {
                        const next = [...prev];
                        next[i] = shuffled[i];
                        return next;
                    });
                }

                if (i === 5) {
                    setIsShuffling(false);
                    setIsFinished(true);
                }
            }, 1000 + i * 400);
        }
    };

    if (!isActive) return null;

    // Helper for Fixed Seats (Driver/Co-driver)
    const renderFixed = (name: string, role: string) => (
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-200 border-2 border-gray-300 h-20">
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
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-2xl">🚗</span>
                    <h2 className="text-xl font-bold">차량 좌석 배치</h2>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                        운전자 고정
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Car 1: 5-Seater */}
                    <div className="relative bg-gray-100 rounded-[30px] p-4 border-4 border-gray-300 shadow-xl">
                        {/* Roof header */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold shadow-md z-10 whitespace-nowrap">
                            1호차 (신우성/이재환)
                        </div>

                        {/* Car Body Layout */}
                        <div className="mt-4 flex flex-col gap-3">
                            {/* Front Row */}
                            <div className="grid grid-cols-2 gap-3">
                                {renderFixed('신우성', '운전')}
                                {renderFixed('이재환', '보조')}
                            </div>
                            {/* Middle Row (Random 3) */}
                            <div className="grid grid-cols-3 gap-2">
                                {renderSeat(0)}
                                {renderSeat(1)}
                                {renderSeat(2)}
                            </div>
                        </div>

                        {/* Wheels decoration */}
                        <div className="absolute -left-2 top-10 w-4 h-12 bg-black rounded-r-lg"></div>
                        <div className="absolute -right-2 top-10 w-4 h-12 bg-black rounded-l-lg"></div>
                        <div className="absolute -left-2 bottom-10 w-4 h-12 bg-black rounded-r-lg"></div>
                        <div className="absolute -right-2 bottom-10 w-4 h-12 bg-black rounded-l-lg"></div>
                    </div>

                    {/* Car 2: 5-Seater */}
                    <div className="relative bg-gray-100 rounded-[30px] p-4 border-4 border-gray-300 shadow-xl">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold shadow-md z-10 whitespace-nowrap">
                            2호차 (김지섭/장민한)
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                            {/* Front Row */}
                            <div className="grid grid-cols-2 gap-3">
                                {renderFixed('김지섭', '운전')}
                                {renderFixed('장민한', '보조')}
                            </div>
                            {/* Middle Row (Random 3) */}
                            <div className="grid grid-cols-3 gap-2">
                                {renderSeat(3)}
                                {renderSeat(4)}
                                {renderSeat(5)}
                            </div>
                        </div>

                        {/* Wheels decoration */}
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
                        className="w-full bg-gradient-to-r from-primary to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                        {isShuffling ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" /> 운명 결정 중...
                            </>
                        ) : (
                            '🎲 뒷좌석 룰렛 돌리기'
                        )}
                    </button>
                    {!isFinished && <p className="mt-4 text-sm text-gray-400">앞자리는 고정입니다. (편-안)</p>}
                </div>
            </div>
        </div>
    );
}
