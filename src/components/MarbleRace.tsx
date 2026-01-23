import { useEffect, useRef, useState, useCallback } from 'react';
import Matter from 'matter-js';
import { Play, RotateCcw, Medal } from 'lucide-react';

interface MarbleRaceProps {
    isActive: boolean;
}

export function MarbleRace({ isActive }: MarbleRaceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);
    const renderRef = useRef<Matter.Render | null>(null);
    const runnerRef = useRef<Matter.Runner | null>(null);
    const gateRef = useRef<Matter.Body | null>(null);

    const [names, setNames] = useState<string>('');
    const [gameState, setGameState] = useState<'IDLE' | 'READY' | 'RUNNING'>('IDLE');
    const [rankings, setRankings] = useState<{ rank: number; name: string }[]>([]);

    // Cleanup function
    const destroyWorld = useCallback(() => {
        if (renderRef.current) {
            Matter.Render.stop(renderRef.current);
            if (renderRef.current.canvas) renderRef.current.canvas.remove();
        }
        if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
        if (engineRef.current) Matter.Engine.clear(engineRef.current);

        engineRef.current = null;
        renderRef.current = null;
        runnerRef.current = null;
        gateRef.current = null;
    }, []);

    // Initialize World
    const initWorld = useCallback(() => {
        if (!containerRef.current || engineRef.current) return;

        const width = containerRef.current.clientWidth || 400;
        const height = 1200; // Fixed height for consistency

        // Engine
        const engine = Matter.Engine.create();
        engine.gravity.y = 0.5;
        engineRef.current = engine;

        // Render
        const render = Matter.Render.create({
            element: containerRef.current,
            engine: engine,
            options: {
                width,
                height,
                wireframes: false,
                background: '#1a1a1a',
                pixelRatio: window.devicePixelRatio
            }
        });
        renderRef.current = render;

        // Build Map
        const { Bodies, Composite } = Matter;
        const wallOpts = { isStatic: true, render: { fillStyle: '#444' } };
        const pegOpts = { isStatic: true, render: { fillStyle: '#888' }, restitution: 0.5 };
        const bounceOpts = { isStatic: true, render: { fillStyle: '#E91E63' }, restitution: 1.2 };

        const bodies: Matter.Body[] = [
            Bodies.rectangle(0, height / 2, 20, height, wallOpts),
            Bodies.rectangle(width, height / 2, 20, height, wallOpts),
            Bodies.rectangle(width / 2, height + 100, width, 100, { isStatic: true, label: 'ground' })
        ];

        // 1. Pins
        const startY = 120;
        for (let row = 0; row < 7; row++) {
            const cols = row % 2 === 0 ? 8 : 7;
            const spacingX = width / (cols + 1);
            for (let col = 1; col <= cols; col++) {
                bodies.push(Bodies.circle(col * spacingX, startY + row * 45, 4, pegOpts));
            }
        }

        // 2. Spinners
        const spinnerX = width / 2;
        const spinnerY = 550;
        const bar1 = Bodies.rectangle(spinnerX, spinnerY, 160, 15, { isStatic: true, render: { fillStyle: '#FFD700' }, label: 'spinner_bar' });
        const bar2 = Bodies.rectangle(spinnerX, spinnerY, 15, 160, { isStatic: true, render: { fillStyle: '#FFD700' }, label: 'spinner_bar' });
        bodies.push(bar1, bar2);

        // 2-2. Bumpers
        bodies.push(Bodies.polygon(width * 0.15, spinnerY - 50, 3, 30, { ...bounceOpts, angle: Math.PI / 3 }));
        bodies.push(Bodies.polygon(width * 0.85, spinnerY - 50, 3, 30, { ...bounceOpts, angle: -Math.PI / 3 }));

        // 3. Slopes
        const slopeY = 800;
        const slopeW = width * 0.55;
        bodies.push(Bodies.rectangle(width * 0.3, slopeY, slopeW, 10, { isStatic: true, angle: 0.4, render: { fillStyle: '#2D9CDB' } }));
        bodies.push(Bodies.rectangle(width * 0.7, slopeY + 120, slopeW, 10, { isStatic: true, angle: -0.4, render: { fillStyle: '#2D9CDB' } }));
        bodies.push(Bodies.rectangle(width * 0.3, slopeY + 240, slopeW, 10, { isStatic: true, angle: 0.4, render: { fillStyle: '#2D9CDB' } }));

        // 4. Funnel
        const funnelY = height - 120;
        bodies.push(Bodies.rectangle(width * 0.2, funnelY, 200, 10, { isStatic: true, angle: 0.5, render: { fillStyle: '#555' } }));
        bodies.push(Bodies.rectangle(width * 0.8, funnelY, 200, 10, { isStatic: true, angle: -0.5, render: { fillStyle: '#555' } }));

        Composite.add(engine.world, bodies);

        // Mouse Interaction
        const mouse = Matter.Mouse.create(render.canvas);
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        Composite.add(engine.world, mouseConstraint);
        render.mouse = mouse;

        // Events
        Matter.Events.on(engine, 'beforeUpdate', () => {
            // Spinner animation
            Matter.Body.rotate(bar1, 0.05);
            Matter.Body.rotate(bar2, 0.05);
        });

        // Check Rankings
        Matter.Events.on(engine, 'afterUpdate', () => {
            const allBodies = Matter.Composite.allBodies(engine.world);
            allBodies.forEach(b => {
                // Check if it's a marble (has a name label)
                if (b.label && b.label !== 'ground' && b.label !== 'spinner_bar' && b.label !== 'gate' && b.label !== 'mouseConstraint'
                    && b.label !== 'Rectangle Body' && b.label !== 'Circle Body' && b.label !== 'Polygon Body') {

                    if (b.position.y > height + 20) {
                        // Determine if already ranked
                        setRankings(prev => {
                            if (prev.find(p => p.name === b.label)) return prev;
                            const newRank = prev.length + 1;
                            Matter.Composite.remove(engine.world, b);
                            return [...prev, { rank: newRank, name: b.label }];
                        });
                    }
                }
            });
        });

        // Run
        Matter.Render.run(render);
        const runner = Matter.Runner.create();
        runnerRef.current = runner;
        Matter.Runner.run(runner, engine);

    }, []);

    useEffect(() => {
        if (isActive) {
            setTimeout(initWorld, 100);
        }
        // We don't destroy on inactive to keep state? 
        // Code in script.js re-inits on switchGame if 'marble'.
        // Here we can keep it alive.
    }, [isActive, initWorld]);


    const startGame = () => {
        if (gameState === 'IDLE') {
            prepareMarbles();
        } else if (gameState === 'READY') {
            openGate();
        } else {
            resetGame();
        }
    };

    const prepareMarbles = () => {
        const list = names.split(',').map(s => s.trim()).filter(Boolean);
        if (list.length < 2) {
            alert('최소 2명 입력해주세요');
            return;
        }

        if (!engineRef.current || !renderRef.current) return;

        // Clear dynamic bodies
        const { Composite, Bodies } = Matter;
        const world = engineRef.current.world;
        const all = Composite.allBodies(world);
        all.forEach(b => {
            if (!b.isStatic && b.label !== 'mouseConstraint') Composite.remove(world, b);
        });

        setRankings([]); // Reset rankings

        // Create Gate
        const width = renderRef.current.options.width!;
        const gate = Bodies.rectangle(width / 2, 80, width * 0.8, 10, {
            isStatic: true,
            render: { fillStyle: '#FFF', opacity: 0.8 },
            label: 'gate'
        });
        gateRef.current = gate;
        Composite.add(world, gate);

        // Spawn Marbles
        const colors = ['#FF6B00', '#2D9CDB', '#FFD700', '#4CAF50', '#9C27B0', '#E91E63'];

        list.forEach((name, i) => {
            const x = width / 2 + (Math.random() - 0.5) * 100;
            const marble = Bodies.circle(x, 0, 9, {
                restitution: 0.7,
                friction: 0.005,
                density: 0.04,
                label: name,
                render: { fillStyle: colors[i % colors.length] }
            });
            Composite.add(world, marble);
        });

        setGameState('READY');
    };

    const openGate = () => {
        if (gateRef.current && engineRef.current) {
            Matter.Composite.remove(engineRef.current.world, gateRef.current);
            gateRef.current = null;
            setGameState('RUNNING');
        }
    };

    const resetGame = () => {
        setGameState('IDLE');
        setRankings([]);
        if (!engineRef.current) return;

        const { Composite } = Matter;
        const world = engineRef.current.world;
        const all = Composite.allBodies(world);
        all.forEach(b => {
            if (!b.isStatic && b.label !== 'mouseConstraint') Composite.remove(world, b);
        });
        if (gateRef.current) Composite.remove(world, gateRef.current);
        gateRef.current = null;
    };

    return (
        <div className={`p-5 pb-24 ${isActive ? 'block' : 'hidden'} animate-slide-up bg-[#111] min-h-screen text-white`}>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">🎱 마블 레이스 (순서 정하기)</h2>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                        placeholder="이름 입력 (콤마로 구분)"
                        className="flex-1 bg-[#333] border border-[#555] rounded-lg px-3 py-2 text-white text-sm"
                    />
                </div>
                <button
                    onClick={startGame}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${gameState === 'IDLE' ? 'bg-primary hover:bg-orange-600' :
                            gameState === 'READY' ? 'bg-green-600 hover:bg-green-700 animate-pulse' :
                                'bg-gray-600 hover:bg-gray-700'
                        }`}
                >
                    {gameState === 'IDLE' ? '준비 (READY)' :
                        gameState === 'READY' ? '🚀 출발! (GO)' : '🔄 리셋 (RESET)'}
                </button>
            </div>

            {/* Physics Container */}
            <div ref={containerRef} className="w-full h-[600px] bg-[#1a1a1a] rounded-xl overflow-hidden relative shadow-inner border border-[#333]">
                {/* Live Rankings Overlay */}
                {rankings.length > 0 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white p-3 rounded-xl border border-white/10 max-h-[200px] overflow-y-auto">
                        <h4 className="text-xs font-bold text-gray-400 mb-2">🏆 순위</h4>
                        {rankings.map(r => (
                            <div key={r.rank} className="flex justify-between w-32 mb-1 text-sm bg-black/30 p-1.5 rounded">
                                <span className={`${r.rank <= 3 ? 'text-yellow-400 font-bold' : ''}`}>{r.rank}위</span>
                                <span>{r.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-8 p-4 bg-[#222] rounded-xl">
                <h3 className="text-sm text-gray-400 mb-3">📋 결과 보드</h3>
                <div className="flex flex-wrap gap-2">
                    {rankings.map(r => (
                        <div key={r.rank} className="flex flex-col items-center bg-[#333] p-2 rounded-lg w-20">
                            <div className="text-2xl mb-1">{r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : '🎉'}</div>
                            <div className="font-bold text-sm">{r.name}</div>
                            <div className="text-[10px] text-gray-500">{r.rank}위</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
