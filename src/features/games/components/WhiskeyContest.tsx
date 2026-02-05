import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { GAME_PARTICIPANTS } from './participants';

interface WhiskeyScore {
    name: string;
    count: number;
}

export function WhiskeyContest({ isActive }: { isActive: boolean }) {
    const [scores, setScores] = useState<WhiskeyScore[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Initialize scores with 0 for everyone
    const initialScores = GAME_PARTICIPANTS.map(name => ({ name, count: 0 }));

    useEffect(() => {
        if (isActive) {
            fetchScores();
            
            const channel = supabase
                .channel('whiskey_contest_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'whiskey_contest'
                    },
                    (payload) => {
                        console.log('Realtime update:', payload);
                        fetchScores();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [isActive]);

    const fetchScores = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('whiskey_contest')
                .select('*');

            if (error) {
                console.error('Error fetching scores:', error);
                if (scores.length === 0) setScores(initialScores);
                return;
            }

            const mergedScores = GAME_PARTICIPANTS.map(name => {
                const dbRecord = data?.find(d => d.name === name);
                return {
                    name,
                    count: dbRecord ? dbRecord.count : 0
                };
            });

            // Sort by score descending
            mergedScores.sort((a, b) => b.count - a.count);
            setScores(mergedScores);
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateScore = async (name: string, newCount: number) => {
        if (newCount < 0) return;

        // Optimistic update
        setScores(prev => {
            const newScores = prev.map(p => 
                p.name === name ? { ...p, count: newCount } : p
            );
            return [...newScores].sort((a, b) => b.count - a.count);
        });
        
        setLastUpdated(name);
        setTimeout(() => setLastUpdated(null), 1000);

        try {
            const { error } = await supabase
                .from('whiskey_contest')
                .upsert({ name, count: newCount }, { onConflict: 'name' });

            if (error) {
                console.error('Error updating score:', error);
                alert('저장 실패! (DB 연결 확인 필요)');
            }
        } catch (err) {
            console.error('Error sending update:', err);
        }
    };

    if (!isActive) return null;

    return (
        <div className="p-4 pb-20 space-y-4 animate-slide-up">
            <div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-2xl p-6 shadow-xl border border-amber-700 text-amber-50">
                <div className="text-center mb-6">
                    <div className="text-5xl mb-2">🥃</div>
                    <h2 className="text-2xl font-black text-amber-400 mb-2">조니워커 블라인드</h2>
                    <p className="text-amber-200/70 text-sm">
                        블루/블랙/골드/그린/레드...<br/>
                        당신의 혀는 얼마나 예민합니까?
                    </p>
                </div>

                <div className="space-y-3">
                    {scores.map((person, index) => (
                        <div 
                            key={person.name}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                                index === 0 && person.count > 0 
                                    ? 'bg-amber-100/10 border-amber-400 shadow-lg scale-[1.02]' 
                                    : 'bg-black/20 border-amber-900/50 hover:bg-black/30'
                            }`}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                                    index === 0 && person.count > 0 ? 'bg-amber-400 text-amber-950' : 
                                    index === 1 && person.count > 0 ? 'bg-gray-300 text-gray-800' : 
                                    index === 2 && person.count > 0 ? 'bg-orange-600 text-white' : 
                                    'bg-amber-900/50 text-amber-500'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <span className={`font-bold text-lg ${index === 0 && person.count > 0 ? 'text-amber-300' : 'text-amber-100'}`}>
                                        {person.name}
                                    </span>
                                    {lastUpdated === person.name && (
                                        <span className="ml-2 text-xs font-bold text-amber-400 animate-ping">
                                            Correct!
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateScore(person.name, person.count - 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-900/50 text-amber-500 hover:bg-amber-800 active:scale-95 transition-all text-xl font-bold border border-amber-800"
                                    disabled={person.count <= 0}
                                >
                                    -
                                </button>
                                
                                <div className="w-12 text-center font-black text-2xl text-amber-400">
                                    {person.count}
                                </div>

                                <button
                                    onClick={() => updateScore(person.name, person.count + 1)}
                                    className="w-12 h-10 flex items-center justify-center rounded-xl bg-amber-600 text-white hover:bg-amber-500 active:scale-95 transition-all text-sm font-bold border border-amber-400 shadow-lg shadow-amber-900/50"
                                >
                                    정답
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {scores.length === 0 && !loading && (
                    <div className="text-center py-10 text-amber-500/50">
                        데이터를 불러오는 중...
                    </div>
                )}
            </div>
        </div>
    );
}
