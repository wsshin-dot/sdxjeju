import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { GAME_PARTICIPANTS } from './participants';

interface StockCount {
    name: string;
    count: number;
}

export function StockCounter({ isActive }: { isActive: boolean }) {
    const [counts, setCounts] = useState<StockCount[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Initialize counts with 0 for everyone
    const initialCounts = GAME_PARTICIPANTS.map(name => ({ name, count: 0 }));

    useEffect(() => {
        if (isActive) {
            fetchCounts();
            
            // Subscribe to realtime changes
            const channel = supabase
                .channel('stock_counts_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'stock_counts'
                    },
                    (payload) => {
                        console.log('Realtime update:', payload);
                        fetchCounts();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [isActive]);

    const fetchCounts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('stock_counts')
                .select('*');

            if (error) {
                console.error('Error fetching counts:', error);
                // Fallback to local state if DB fails (or table doesn't exist yet)
                if (counts.length === 0) setCounts(initialCounts);
                return;
            }

            // Merge DB data with participant list to ensure everyone is shown
            const mergedCounts = GAME_PARTICIPANTS.map(name => {
                const dbRecord = data?.find(d => d.name === name);
                return {
                    name,
                    count: dbRecord ? dbRecord.count : 0
                };
            });

            // Sort by count descending
            mergedCounts.sort((a, b) => b.count - a.count);
            setCounts(mergedCounts);
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = async (name: string, currentCount: number) => {
        // Optimistic update
        // We update locally first, then re-sort
        setCounts(prev => {
            const newCounts = prev.map(p => 
                p.name === name ? { ...p, count: p.count + 1 } : p
            );
            return [...newCounts].sort((a, b) => b.count - a.count);
        });
        
        setLastUpdated(name);
        setTimeout(() => setLastUpdated(null), 1000);

        try {
            const { error } = await supabase
                .from('stock_counts')
                .upsert({ name, count: currentCount + 1 }, { onConflict: 'name' });

            if (error) {
                console.error('Error updating count:', error);
                // Revert if needed
                alert('저장 실패! (DB 연결 확인 필요)');
            }
        } catch (err) {
            console.error('Error sending update:', err);
        }
    };

    if (!isActive) return null;

    return (
        <div className="p-4 pb-20 space-y-4">
            <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-red-600 mb-2">📈 주식무새 판독기</h2>
                    <p className="text-gray-500 text-sm">
                        "주식", "코인", "나스닥", "테슬라" 언급 시<br/>
                        가차없이 버튼을 눌러주세요.
                    </p>
                </div>

                <div className="space-y-3">
                    {counts.map((person, index) => (
                        <div 
                            key={person.name}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                                index === 0 && person.count > 0 
                                    ? 'bg-red-50 border-red-200 shadow-md transform scale-[1.02]' 
                                    : 'bg-white border-gray-100 hover:border-red-100'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                                    index === 0 && person.count > 0 ? 'bg-red-500 text-white' : 
                                    index === 1 && person.count > 0 ? 'bg-orange-400 text-white' : 
                                    index === 2 && person.count > 0 ? 'bg-yellow-400 text-white' : 
                                    'bg-gray-100 text-gray-500'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <span className="font-bold text-gray-800 text-lg">{person.name}</span>
                                    {lastUpdated === person.name && (
                                        <span className="ml-2 text-xs font-bold text-red-500 animate-ping">
                                            +1
                                        </span>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleIncrement(person.name, person.count)}
                                className="group relative flex items-center gap-2 bg-white hover:bg-red-50 border-2 border-red-100 hover:border-red-300 px-4 py-2 rounded-xl transition-all active:scale-95"
                            >
                                <span className="text-2xl font-black text-red-500 group-hover:scale-110 transition-transform">
                                    {person.count}
                                </span>
                                <span className="text-xs font-medium text-gray-400 group-hover:text-red-400">
                                    적발
                                </span>
                            </button>
                        </div>
                    ))}
                </div>

                {counts.length === 0 && !loading && (
                    <div className="text-center py-10 text-gray-400">
                        데이터를 불러오는 중...
                    </div>
                )}
            </div>
        </div>
    );
}
