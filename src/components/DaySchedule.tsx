import { useRainMode } from '../contexts/RainModeContext';
import type { ScheduleItem } from '../data/schedule';
import { MapViewer } from './map/MapViewer';
import type { DayBudget } from '../types';
import { formatWon } from '../utils/format';
import { MapPin } from 'lucide-react';

interface DayScheduleProps {
    dayKey: 'day1' | 'day2' | 'day3';
    title: string;
    icon: React.ReactNode;
    schedule: ScheduleItem[];
    budgetData?: DayBudget;
    isActive: boolean;
    costMap?: Record<string, number>; // Full cost map to look up custom tags
}

export function DaySchedule({ dayKey, title, icon, schedule, budgetData, isActive, costMap }: DayScheduleProps) {
    const { isRainy } = useRainMode();

    return (
        <div className={`p-5 pb-24 ${isActive ? 'block' : 'hidden'} animate-slide-up`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                    <span className="text-xl text-primary">{icon}</span>
                    <h2 className="text-lg font-bold text-text-main">{title}</h2>
                </div>

                {/* Budget Bar */}
                {budgetData && (
                    <div className="flex justify-between items-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200 mb-5 text-center">
                        <div className="flex-1">
                            <div className="text-[10px] text-text-sub mb-1">예상 비용</div>
                            <div className="text-sm font-bold text-red-500">~{formatWon(budgetData.cost)}</div>
                        </div>
                        <div className="w-[1px] h-6 bg-gray-300 mx-2" />
                        <div className="flex-1">
                            <div className="text-[10px] text-text-sub mb-1">누적 사용</div>
                            <div className="text-sm font-bold text-text-main">~{formatWon(budgetData.cumulative)}</div>
                        </div>
                        <div className="w-[1px] h-6 bg-gray-300 mx-2" />
                        <div className="flex-1">
                            <div className="text-[10px] text-text-sub mb-1">남은 예산</div>
                            <div className="text-sm font-bold text-green-600">~{formatWon(budgetData.remaining)}</div>
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="relative pl-6 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-[2px] before:bg-border">
                    {schedule.map((item, idx) => {
                        // Filter logic if item has sunny-only or rainy-only classes in original HTML?
                        // In our data structure, we can add `condition?: 'sunny' | 'rainy'`
                        // For now, assuming standard items. 
                        // In the original, specific *descriptions* were conditional.
                        // We'll simplify for now.
                        return (
                            <div key={idx} className="relative mb-8 last:mb-0">
                                <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-[3px] z-10 box-content ${item.highlight ? 'bg-primary border-white ring-2 ring-primary/20' : 'bg-white border-primary'}`} />

                                <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                                    <span className="text-base font-bold text-primary">{item.time}</span>
                                    <span className="text-base font-semibold text-text-main">{item.title}</span>
                                    {item.badges && item.badges.map((b, i) => (
                                        <span key={i} className={`text-xs px-2 py-0.5 rounded font-semibold ${b.color === 'red' ? 'bg-red-50 text-red-500' :
                                            b.color === 'blue' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'
                                            }`}>{b.text}</span>
                                    ))}
                                    {item.costTag && costMap && (
                                        <span className="text-xs px-2 py-0.5 rounded font-semibold bg-red-50 text-red-500">
                                            1인 {formatWon(costMap[item.costTag.id] || 0)}
                                        </span>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-xl p-4 border border-black/5">
                                    {item.desc?.map((d, i) => (
                                        <p key={i} className="text-sm text-text-sub mb-2 last:mb-0 whitespace-pre-line">{d}</p>
                                    ))}

                                    {item.mapLink && (
                                        <a href={item.mapLink.url} target="_blank" rel="noreferrer" className="inline-flex items-center text-xs font-semibold text-secondary mt-2 hover:underline">
                                            <MapPin className="w-3 h-3 mr-1" /> {item.mapLink.name}
                                        </a>
                                    )}

                                    {item.subItems && (
                                        <div className="mt-3 pt-3 border-t border-dashed border-gray-300">
                                            {item.subItems.map((sub, i) => (
                                                <div key={i} className="mb-2 last:mb-0">
                                                    <div className="text-sm font-bold text-gray-700">· {sub.title}</div>
                                                    <div className="text-xs text-text-sub pl-3 whitespace-pre-wrap">{sub.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {item.options && (
                                        <div className="grid gap-2 mt-3">
                                            {item.options.map((opt, i) => (
                                                <a key={i} href={opt.mapUrl || '#'} target={opt.mapUrl ? "_blank" : undefined} className="block no-underline">
                                                    <div className="bg-white border border-border rounded-xl p-3 flex justify-between items-center hover:border-primary transition-colors cursor-pointer shadow-sm">
                                                        <div className="flex-1">
                                                            <div>
                                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mr-1.5 ${opt.isRec ? 'bg-orange-50 text-primary' : 'bg-gray-100 text-gray-500'}`}>{opt.tag}</span>
                                                                <span className="text-sm font-semibold text-text-main">{opt.tagName}</span>
                                                            </div>
                                                            {opt.price && <div className="text-xs font-semibold text-red-500 mt-0.5">{opt.price}</div>}
                                                            <div className="text-xs text-text-sub mt-0.5">{opt.desc}</div>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                                            <MapPin className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <MapViewer dayKey={dayKey} active={isActive} />
            </div>
        </div>
    );
}
