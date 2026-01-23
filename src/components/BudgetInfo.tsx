import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import type { BudgetCosts } from '../types';
import { formatWon } from '../utils/format';
import { Lock, Unlock, Save } from 'lucide-react';

export function BudgetInfo({ isActive }: { isActive: boolean }) {
    const { config, calculation, saveBudget, saving, updateCost } = useBudget();
    const [unlocked, setUnlocked] = useState(false);
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);

    const costs = config.costs;

    const handleUnlock = () => {
        if (unlocked) {
            setUnlocked(false);
        } else {
            setShowModal(true);
        }
    };

    const submitPassword = () => {
        if (password === '901210') {
            setUnlocked(true);
            setShowModal(false);
            setPassword('');
        } else {
            alert('비밀번호가 틀렸습니다!');
        }
    };

    const handleCostChange = (key: keyof BudgetCosts, val: string) => {
        updateCost(key, parseInt(val) || 0);
    };

    return (
        <div className={`p-5 pb-24 ${isActive ? 'block' : 'hidden'} animate-slide-up`}>
            {/* Total Budget Card */}
            <div className="bg-[#212529] text-white rounded-2xl overflow-hidden shadow-lg mb-5">
                <div className="text-center py-6 border-b border-white/10">
                    <h3 className="text-sm opacity-70 font-normal mb-1">1인당 예산</h3>
                    <div className="text-3xl font-bold text-[#FFD700]">{formatWon(config.totalBudgetPerPerson)}</div>
                </div>
                <div className="grid grid-cols-3 gap-[1px] bg-white/10">
                    <div className="bg-[#212529] p-4 text-center">
                        <div className="text-xs opacity-60 mb-1">항공권</div>
                        <div className="font-semibold">{formatWon(costs.flight)}</div>
                    </div>
                    <div className="bg-[#212529] p-4 text-center">
                        <div className="text-xs opacity-60 mb-1">렌트+기름</div>
                        <div className="font-semibold">{formatWon(costs.rent)}</div>
                    </div>
                    <div className="bg-[#212529] p-4 text-center">
                        <div className="text-xs opacity-60 mb-1">식비/활동</div>
                        <div className="font-semibold">~{formatWon(calculation.total - costs.flight - costs.rent)}</div>
                    </div>
                </div>
                <div className="bg-[#2e343a] p-3 text-center text-xs opacity-80">
                    숙소: 1인 2만원(별도) | 총 예산: {formatWon(config.totalBudget)} ({config.personCount}명)
                </div>
            </div>

            {/* Info Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-5">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">🏠 숙소 & 차량 정보</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <div className="text-primary text-2xl mb-2">🏨</div>
                        <span className="text-xs text-text-sub block mb-1">숙소명</span>
                        <div className="font-bold text-base">씨사이드 아덴</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <div className="text-primary text-2xl mb-2">🚗</div>
                        <span className="text-xs text-text-sub block mb-1">운전자</span>
                        <div className="font-bold text-base leading-snug">신우성, 김지섭<br /><span className="text-xs font-normal text-gray-500">예비: 이재환, 장민한</span></div>
                    </div>
                </div>
            </div>

            {/* Calculator */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">💰 예산 계산기</h3>
                    <button onClick={handleUnlock} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${unlocked ? 'bg-gray-200 text-gray-700' : 'bg-primary/10 text-primary'}`}>
                        {unlocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        {unlocked ? '잠금' : '잠금해제'}
                    </button>
                </div>

                {!unlocked && (
                    <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg mb-4 border border-orange-100">
                        🔒 수정하려면 잠금해제를 눌러주세요.
                    </div>
                )}

                <div className="flex flex-col gap-3 mb-6">
                    <InputRow label="항공권" value={costs.flight} onChange={(v) => handleCostChange('flight', v)} disabled={!unlocked} />
                    <InputRow label="렌트+기름 (1인)" value={costs.rent} onChange={(v) => handleCostChange('rent', v)} disabled={!unlocked} />
                    <InputRow label="흑돼지 (1인)" value={costs.day1Dinner} onChange={(v) => handleCostChange('day1Dinner', v)} disabled={!unlocked} />
                    <InputRow label="양주 (총액/N)" value={costs.whiskey} onChange={(v) => handleCostChange('whiskey', v)} disabled={!unlocked} labelDetail="(총액/10)" />
                    <InputRow label="9.81 파크" value={costs.park981} onChange={(v) => handleCostChange('park981', v)} disabled={!unlocked} />
                </div>

                {unlocked && (
                    <button
                        onClick={saveBudget}
                        disabled={saving}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> {saving ? '저장 중...' : 'DB에 저장하기'}
                    </button>
                )}
            </div>

            {/* Unlock Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xs p-6 text-center shadow-2xl transform scale-100 transition-all">
                        <h3 className="text-xl font-bold mb-4">비밀번호 입력</h3>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            className="w-full bg-gray-100 rounded-lg px-4 py-3 mb-4 text-center font-bold text-lg focus:ring-2 focus:ring-primary outline-none"
                        />
                        <div className="flex gap-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold">취소</button>
                            <button onClick={submitPassword} className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">확인</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface InputRowProps {
    label: string;
    value: number;
    onChange: (val: string) => void;
    disabled: boolean;
    labelDetail?: string;
}

function InputRow({ label, value, onChange, disabled, labelDetail }: InputRowProps) {
    return (
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex-1 font-medium text-sm text-text-main">
                {label} {labelDetail && <span className="text-xs text-text-sub">{labelDetail}</span>}
            </div>
            <div className="flex items-center gap-1">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-24 text-right bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:bg-transparent disabled:border-transparent disabled:font-bold disabled:text-black"
                />
                <span className="text-xs text-text-sub">원</span>
            </div>
        </div>
    );
}
