import { useState, useRef } from 'react';
import { useBudget } from '../hooks/useBudget';
import type { BudgetCosts } from '../types';
import { formatWon } from '../utils/format';
import { Lock, Unlock, Save, Trash2 } from 'lucide-react';

export function BudgetInfo({ isActive }: { isActive: boolean }) {
    const { config, calculation, saveBudget, saving, updateCost, addCustomItem, updateCustomItem, removeCustomItem, updateConfigValue } = useBudget();
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
                        <a href="https://map.naver.com/p/search/씨사이드아덴" target="_blank" className="font-bold text-base hover:underline text-primary flex items-center justify-center gap-1">
                            씨사이드 아덴 🔗
                        </a>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <div className="text-primary text-2xl mb-2">🚗</div>
                        <span className="text-xs text-text-sub block mb-1">운전자</span>
                        <div className="font-bold text-base leading-snug">신우성, 김지섭<br /><span className="text-xs font-normal text-gray-500">예비: 이재환, 장민한</span></div>
                        <div className="text-xs text-gray-500 mt-1">싼타페 디젤 DCT (꿀렁임 있음)</div>
                        <a href="https://www.billycar.co.kr/skr/common/comm-img-srvr/doc/car/santafeTM_guide.pdf" target="_blank" className="text-primary text-xs font-bold mt-1 inline-flex items-center gap-1 hover:underline">
                            ℹ️ 차량 가이드 보기
                        </a>
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

                <div className="flex flex-col gap-2 mb-6">
                    <SwipeableRow label="총 예산" value={config.totalBudget} onChange={(v) => updateConfigValue('totalBudget', parseInt(v) || 0)} disabled={!unlocked} />
                    <SwipeableRow label="인원 수" value={config.personCount} onChange={(v) => updateConfigValue('personCount', parseInt(v) || 0)} disabled={!unlocked} unit="명" />
                    <hr className="border-gray-100 my-1" />
                    <SwipeableRow label="항공권" value={costs.flight} onChange={(v) => handleCostChange('flight', v)} disabled={!unlocked} onDelete={() => handleCostChange('flight', '0')} />
                    <SwipeableRow label="렌트+기름 (1인)" value={costs.rent} onChange={(v) => handleCostChange('rent', v)} disabled={!unlocked} onDelete={() => handleCostChange('rent', '0')} />
                    <SwipeableRow label="흑돼지 (1인)" value={costs.day1Dinner} onChange={(v) => handleCostChange('day1Dinner', v)} disabled={!unlocked} onDelete={() => handleCostChange('day1Dinner', '0')} />
                    <SwipeableRow label="양주 (총액/N)" value={costs.whiskey} onChange={(v) => handleCostChange('whiskey', v)} disabled={!unlocked} labelDetail="(총액/10)" onDelete={() => handleCostChange('whiskey', '0')} />
                    <SwipeableRow label="9.81 파크" value={costs.park981} onChange={(v) => handleCostChange('park981', v)} disabled={!unlocked} onDelete={() => handleCostChange('park981', '0')} />
                    <SwipeableRow label="Day2 점심" value={costs.day2Lunch} onChange={(v) => handleCostChange('day2Lunch', v)} disabled={!unlocked} onDelete={() => handleCostChange('day2Lunch', '0')} />
                    <SwipeableRow label="Day2 카페" value={costs.day2Cafe} onChange={(v) => handleCostChange('day2Cafe', v)} disabled={!unlocked} onDelete={() => handleCostChange('day2Cafe', '0')} />
                    <SwipeableRow label="올레시장(저녁)" value={costs.day2Dinner} onChange={(v) => handleCostChange('day2Dinner', v)} disabled={!unlocked} onDelete={() => handleCostChange('day2Dinner', '0')} />
                </div>

                {/* Custom Items */}
                <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-400 mb-2">추가 항목 (왼쪽으로 밀어서 삭제)</h4>
                    <div className="flex flex-col gap-2">
                        {config.costs.customItems?.map((item, idx) => (
                            <SwipeableRow
                                key={idx}
                                isCustom={true}
                                label={item.label}
                                onLabelChange={(val: string) => updateCustomItem(idx, 'label', val)}
                                value={item.value}
                                onChange={(val) => updateCustomItem(idx, 'value', parseInt(val) || 0)}
                                checked={item.confirmed}
                                onCheck={(val: boolean) => updateCustomItem(idx, 'confirmed', val)}
                                disabled={!unlocked}
                                onDelete={() => removeCustomItem(idx)}
                            />
                        ))}
                    </div>

                    {unlocked && (
                        <button
                            onClick={addCustomItem}
                            className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1"
                        >
                            + 항목 추가하기
                        </button>
                    )}
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

interface SwipeableRowProps {
    label: string;
    value: number;
    onChange: (val: string) => void;
    onDelete?: () => void;
    disabled: boolean;
    labelDetail?: string;
    isCustom?: boolean;
    onLabelChange?: (val: string) => void;
    checked?: boolean;
    onCheck?: (checked: boolean) => void;
    unit?: string; // Unit to display (default: 원)
}

function SwipeableRow({ label, value, onChange, onDelete, disabled, labelDetail, isCustom, onLabelChange, checked, onCheck, unit = '원' }: SwipeableRowProps) {
    const [offsetX, setOffsetX] = useState(0);
    const startX = useRef(0);
    const backgroundRef = useRef<HTMLDivElement>(null);

    const onTouchStart = (e: React.TouchEvent) => {
        if (disabled || !onDelete) return;
        startX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (disabled || !onDelete) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX.current;
        if (diff < 0) { // dragging left
            e.stopPropagation(); // Prevent global swipe
            setOffsetX(Math.max(diff, -80));
        }
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (disabled || !onDelete) return;
        if (offsetX < -50) {
            // If swiped far enough (> -50), lock it open. User clicks red area to delete.
            if (offsetX < -40) {
                setOffsetX(-60); // Keep open
            } else {
                setOffsetX(0);
            }
        } else {
            setOffsetX(0);
        }
    };

    // Handle delete click
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(isCustom ? '삭제하시겠습니까?' : '값을 초기화하시겠습니까?')) {
            onDelete && onDelete();
            setOffsetX(0);
        }
    };

    return (
        <div className="relative h-[56px] mb-1 overflow-hidden rounded-xl select-none">
            {/* Background (Delete Btn) */}
            <div
                className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4 cursor-pointer"
                onClick={handleDelete}
            >
                <Trash2 className="text-white w-5 h-5" />
            </div>

            {/* Foreground */}
            <div
                className={`relative h-full flex items-center gap-2 p-3 ${isCustom ? 'bg-orange-50/50 border border-orange-100' : 'bg-gray-50 border border-gray-100'} rounded-xl transition-transform duration-200`}
                style={{ transform: `translateX(${offsetX}px)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={() => setOffsetX(0)} // Tap to close
            >
                {isCustom && onCheck && (
                    <input type="checkbox" checked={checked} onChange={(e) => onCheck(e.target.checked)} disabled={disabled} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
                )}

                <div className="flex-1 min-w-0">
                    {isCustom && onLabelChange ? (
                        <input type="text" value={label} onChange={(e) => onLabelChange(e.target.value)} disabled={disabled} placeholder="항목명" className="w-full bg-transparent outline-none text-sm font-medium" />
                    ) : (
                        <div className="text-sm font-medium text-gray-700 truncate">{label} <span className="text-xs text-gray-400 font-normal">{labelDetail}</span></div>
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <input type="number" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="w-20 text-right bg-white/50 border border-gray-200 rounded px-1 py-1 text-sm outline-none focus:border-primary disabled:bg-transparent disabled:border-transparent" />
                    <span className="text-xs text-gray-500">{unit}</span>
                </div>
            </div>
        </div>
    )
}
