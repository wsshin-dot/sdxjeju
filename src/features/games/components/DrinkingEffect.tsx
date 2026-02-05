import { useEffect, useState } from 'react';

export function DrinkingEffect({ name, count, onComplete }: { name: string; count: number; onComplete: () => void }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Vibrate if supported
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 400]);
        }

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 300); // Wait for fade out
        }, 2500);

        return () => clearTimeout(timer);
    }, [name, count, onComplete]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop with flash effect */}
            <div className="absolute inset-0 bg-red-500/30 animate-pulse-fast backdrop-blur-sm" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center animate-bounce-in">
                <div className="text-[80px] animate-wiggle">🍺</div>
                <div className="bg-white/95 border-4 border-red-500 p-6 rounded-3xl shadow-2xl text-center transform rotate-[-2deg]">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">
                        {name} <span className="text-red-600">{count}회</span> 달성!
                    </h2>
                    <p className="text-xl font-bold text-gray-600 mb-4">
                        벌써 5번째다...
                    </p>
                    <div className="text-4xl font-black text-red-600 animate-pulse border-t-2 border-dashed border-gray-300 pt-4">
                        마셔라! 마셔라! 🍻
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes pulse-fast {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.7; }
                }
                @keyframes bounce-in {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.1); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes wiggle {
                    0%, 100% { transform: rotate(-10deg); }
                    50% { transform: rotate(10deg); }
                }
                .animate-pulse-fast { animation: pulse-fast 0.5s infinite; }
                .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
            `}</style>
        </div>
    );
}
