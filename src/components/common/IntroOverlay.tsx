import { useEffect, useState } from 'react';

export function IntroOverlay() {
    const [visible, setVisible] = useState(true);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Start animation sequence
        const timer1 = setTimeout(() => setAnimate(true), 800);
        const timer2 = setTimeout(() => setVisible(false), 2800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-[#FF6B00] flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${animate ? 'translate-y-[-100%]' : ''}`}
            style={{ transitionDelay: '1.2s' }}
        >
            <div className="text-center text-white mb-20">
                <div className="text-2xl font-light mb-2">SDx 플랫폼</div>
                <div className="text-4xl font-bold animate-pulse">신나는 제주 팀데이</div>
            </div>
            <div className={`text-[90px] absolute transition-all duration-1000 ${animate ? 'tangerine-drop' : 'top-[-200px]'}`}>
                🍊
            </div>
        </div>
    );
}
