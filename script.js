
// ========================================
// ?뮥 ?덉궛 以묒븰 愿由??쒖뒪??
// ========================================
const BUDGET_CONFIG = {
    totalBudget: 3500000, // 珥??덉궛
    personCount: 10,      // ?몄썝 ??
    totalBudgetPerPerson: 350000, // 1?몃떦 ?덉궛 (?먮룞怨꾩궛)
    costs: {
        flight: 100000,      // ??났沅?
        rent: 40000,         // ?뚰듃+湲곕쫫
        day1Dinner: 50000,   // Day1 ???(?좎슦???묐뤌吏)
        whiskey: 20000,      // ?묒＜ (20留뚯썝/10紐?
        day2Lunch: 24000,    // Day2 ?먯떖
        park981: 37000,      // Day2 9.81?뚰겕
        day2Cafe: 8000,      // Day2 移댄럹
        day2Dinner: 40000    // Day2 ???(?щ젅?쒖옣)
    }
};

// Day蹂?鍮꾩슜 怨꾩궛
function calcDayBudgets() {
    const c = BUDGET_CONFIG.costs;
    const customTotal = c.customTotal || 0;
    const day1 = c.flight + c.rent + c.day1Dinner + c.whiskey;
    const day2 = c.day2Lunch + c.park981 + c.day2Cafe + c.day2Dinner;
    const day3 = customTotal; // 而ㅼ뒪? ??ぉ? Day3???쒖떆
    const total = day1 + day2 + day3;
    // 珥??덉궛?먯꽌 紐⑤뱺 鍮꾩슜 李④컧 (?⑥닚 怨꾩궛)
    const remaining = BUDGET_CONFIG.totalBudgetPerPerson - total;

    return {
        day1: { cost: day1, cumulative: day1, remaining: BUDGET_CONFIG.totalBudgetPerPerson - day1 },
        day2: { cost: day2, cumulative: day1 + day2, remaining: BUDGET_CONFIG.totalBudgetPerPerson - day1 - day2 },
        day3: { cost: day3, cumulative: total, remaining: remaining },
        total: total,
        remaining: remaining
    };
}

// 湲덉븸 ?щ㎎ (留뚯썝 ?⑥쐞)
function formatWon(amount) {
    if (amount >= 10000) {
        const man = amount / 10000;
        return man % 1 === 0 ? `${man} 留뚯썝` : `${man.toFixed(1)} 留뚯썝`;
    }
    return `${amount.toLocaleString()} ??;
}

// 紐⑤뱺 ?덉궛 ?쒖떆 ?낅뜲?댄듃
function updateAllBudgetDisplays() {
    const budgets = calcDayBudgets();

    // [NEW] ?꾩뿭 ?덉궛 ?뺣낫 ?띿뒪???낅뜲?댄듃
    const totalMan = (BUDGET_CONFIG.totalBudget / 10000).toFixed(0);
    const perPersonMan = (BUDGET_CONFIG.totalBudgetPerPerson / 10000).toFixed(0);
    const count = BUDGET_CONFIG.personCount;

    // Header ?몄썝
    const headerPerson = document.getElementById('header-person-count');
    if (headerPerson) headerPerson.textContent = count;

    // Day1 Info Box
    const day1Info = document.getElementById('day1-info-box');
    if (day1Info) {
        day1Info.innerHTML = `?뮕 珥??덉궛 ${totalMan}留뚯썝 (1??${perPersonMan}留뚯썝) | ??났 + ?뚰듃/湲곕쫫 ?ы븿<br>?룧 ?숈냼鍮? 1??2留뚯썝 (蹂꾨룄, ?덉궛 誘명룷?? - ?댁옱???좎엫?먭쾶 2留뚯썝 ?낃툑 ?솋`;
    }

    // Info Tab Per Person
    const infoPerPerson = document.getElementById('info-per-person-budget');
    if (infoPerPerson) infoPerPerson.textContent = BUDGET_CONFIG.totalBudgetPerPerson.toLocaleString() + '??;

    // Info Tab Footer
    const footerInfo = document.getElementById('info-footer-box');
    if (footerInfo) {
        footerInfo.textContent = `?숈냼: 1??2留뚯썝 (?댁옱???좎엫?먭쾶 2留뚯썝 ?낃툑) | 珥??덉궛: ${totalMan}留뚯썝 (${count}紐?`;
    }

    // ?덉궛 湲곗? ?띿뒪??
    const calcCriteria = document.getElementById('calc-criteria');
    if (calcCriteria) calcCriteria.textContent = perPersonMan + '留뚯썝';

    // [NEW] Static Budget Texts Update (IDs & Data attributes)
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    const c = BUDGET_CONFIG.costs;

    // IDs
    setText('disp-flight', `??났 1??${(c.flight / 10000).toFixed(0)}留뚯썝`);
    setText('disp-rent', `?뚰듃+湲곕쫫 1??${(c.rent / 10000).toFixed(0)}留뚯썝`);
    setText('disp-rent-total', `?뮥 珥?${(c.rent * count / 10000).toFixed(0)}留뚯썝 (${count}紐?湲곗?)`);
    setText('disp-day1-dinner-opt', `?몃떦 ${(c.day1Dinner / 10000).toFixed(0)}留뚯썝`);
    setText('disp-whiskey-total', `?뜼 ?묒＜ 援щℓ ?덉젙 (珥?${(c.whiskey * count / 10000).toFixed(0)}留뚯썝)`);
    setText('disp-day2-dinner-opt', `?몃떦 ${(c.day2Dinner / 10000).toFixed(0)}留뚯썝`);

    // Data-cost attributes
    const map = {
        'day1-dinner': 'day1Dinner',
        'whiskey': 'whiskey',
        'day2-lunch': 'day2Lunch',
        '981': 'park981',
        'day2-tour': 'day2Cafe',
        'day2-dinner': 'day2Dinner'
    };
    document.querySelectorAll('[data-cost]').forEach(el => {
        const key = el.dataset.cost;
        const configKey = map[key] || key;
        const val = c[configKey];
        if (val !== undefined) {
            el.textContent = '~' + formatWon(val);
        }
    });

    // Day 1 ?덉궛諛?
    const day1Cost = document.getElementById('day1-cost');
    const day1Total = document.getElementById('day1-total');
    const day1Remain = document.getElementById('day1-remain');
    if (day1Cost) day1Cost.textContent = '~' + formatWon(budgets.day1.cost);
    if (day1Total) day1Total.textContent = '~' + formatWon(budgets.day1.cumulative);
    if (day1Remain) day1Remain.textContent = '~' + formatWon(budgets.day1.remaining);

    // Day 2 ?덉궛諛?
    const day2Cost = document.getElementById('day2-cost');
    const day2Total = document.getElementById('day2-total');
    const day2Remain = document.getElementById('day2-remain');
    if (day2Cost) day2Cost.textContent = '~' + formatWon(budgets.day2.cost);
    if (day2Total) day2Total.textContent = '~' + formatWon(budgets.day2.cumulative);
    if (day2Remain) day2Remain.textContent = '~' + formatWon(budgets.day2.remaining);

    // Day 3 ?덉궛諛?
    const day3Cost = document.getElementById('day3-cost');
    const day3Total = document.getElementById('day3-total');
    const day3Remain = document.getElementById('day3-remain');
    if (day3Cost) day3Cost.textContent = formatWon(budgets.day3.cost);
    if (day3Total) day3Total.textContent = '~' + formatWon(budgets.day3.cumulative);
    if (day3Remain) day3Remain.textContent = '~' + formatWon(budgets.day3.remaining);

    // Info ?섏씠吏 ?덉궛 怨꾩궛湲?
    const totalCost = document.getElementById('total-cost');
    const remainingBudget = document.getElementById('remaining-budget');
    if (totalCost) totalCost.textContent = budgets.total.toLocaleString() + '??;
    if (remainingBudget) {
        if (budgets.remaining >= 0) {
            remainingBudget.textContent = '+' + budgets.remaining.toLocaleString() + '???ъ쑀';
            remainingBudget.style.color = '#4CAF50';
        } else {
            remainingBudget.textContent = budgets.remaining.toLocaleString() + '??珥덇낵';
            remainingBudget.style.color = '#E91E63';
        }
    }

    // ?덉궛 怨꾩궛湲?input 湲곕낯媛??숆린??
    const costInputs = {
        'config-total-budget': BUDGET_CONFIG.totalBudget,
        'config-person-count': BUDGET_CONFIG.personCount,
        'cost-flight': BUDGET_CONFIG.costs.flight,
        'cost-rent': BUDGET_CONFIG.costs.rent,
        'cost-day1-dinner': BUDGET_CONFIG.costs.day1Dinner,
        'cost-981': BUDGET_CONFIG.costs.park981,
        'cost-day2-lunch': BUDGET_CONFIG.costs.day2Lunch,
        'cost-day2-tour': BUDGET_CONFIG.costs.day2Cafe,
        'cost-day2-dinner': BUDGET_CONFIG.costs.day2Dinner
    };
    for (const [id, value] of Object.entries(costInputs)) {
        const input = document.getElementById(id);
        if (input) input.value = value;
    }
}

// ========================================
// ?뵕 Supabase DB API ?곕룞
// ========================================
const SUPABASE_URL = 'https://oiyzxdrssxobsqjtlyjf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_n8CptUQG5FADwx5uHMDIdw_C9G6yUA-';

// Supabase REST API ?몄텧 ?ы띁
async function supabaseRequest(table, method = 'GET', body = null, select = '*') {
    const headers = {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    };

    // JWT ??ey...)??寃쎌슦?먮쭔 Bearer ?몄쬆 ?ㅻ뜑 異붽? (sb_publishable ?????
    if (SUPABASE_KEY.startsWith('ey')) {
        headers['Authorization'] = `Bearer ${SUPABASE_KEY}`;
    }

    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    if (method === 'GET') {
        url += `?select=${select}&order=created_at.desc&limit=1`;
    }
    if (method === 'PATCH') {
        url += '?id=eq.1'; // ??긽 id=1 ?덉퐫???낅뜲?댄듃
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
    }
    return method === 'GET' ? response.json() : response;
}

// DB?먯꽌 ?덉궛 ?곗씠??濡쒕뱶
async function loadBudgetFromDB() {
    const statusEl = document.getElementById('db-status');
    try {
        statusEl.innerHTML = '<span class="db-status loading">?뱻 DB ?곌껐 以?..</span>';

        const data = await supabaseRequest('budget');

        if (data && data.length > 0) {
            const budgetData = data[0];
            // BUDGET_CONFIG ?낅뜲?댄듃
            if (budgetData.costs) {
                // 硫뷀? ?곗씠??珥앹삁???몄썝) 蹂듭썝
                if (budgetData.costs._meta) {
                    BUDGET_CONFIG.totalBudget = budgetData.costs._meta.totalBudget;
                    BUDGET_CONFIG.personCount = budgetData.costs._meta.personCount;
                    // 1?몃떦 ?덉궛 ?ш퀎??
                    BUDGET_CONFIG.totalBudgetPerPerson = Math.floor(BUDGET_CONFIG.totalBudget / BUDGET_CONFIG.personCount);
                } else if (budgetData.total_budget_per_person) {
                    // 硫뷀? ?놁씠 1?몃떦 ?덉궛留??덈뒗 寃쎌슦 (援щ쾭???명솚)
                    BUDGET_CONFIG.totalBudgetPerPerson = budgetData.total_budget_per_person;
                    // totalBudget怨?personCount??湲곕낯媛믪쑝濡??좎??섍굅?? totalBudgetPerPerson * personCount濡?異붿젙
                    // ?ш린?쒕뒗 湲곗〈 totalBudgetPerPerson留?蹂듭썝?섍퀬, totalBudget/personCount??湲곕낯媛??좎?
                    // ?먮뒗, totalBudgetPerPerson??湲곕컲?쇰줈 totalBudget????궛 (湲곗〈 personCount ?ъ슜)
                    BUDGET_CONFIG.totalBudget = BUDGET_CONFIG.totalBudgetPerPerson * BUDGET_CONFIG.personCount;
                }

                // 鍮꾩슜 ?곗씠??蹂듭궗
                Object.assign(BUDGET_CONFIG.costs, budgetData.costs);

                // [NEW] 留??곗씠??濡쒕뱶
                if (budgetData.costs.mapData) {
                    if (budgetData.costs.mapData.locations) {
                        Object.assign(LOCATIONS, budgetData.costs.mapData.locations);
                    }
                    if (budgetData.costs.mapData.routes) {
                        Object.assign(ROUTES, budgetData.costs.mapData.routes);
                    }
                    // 吏??珥덇린??(?곗씠??濡쒕뱶 ??
                    if (typeof initMaps === 'function') initMaps();
                }
            }

            // 而ㅼ뒪? ??ぉ??UI???뚮뜑留?
            renderCustomItemsFromDB();

            updateAllBudgetDisplays();
            statusEl.innerHTML = '<span class="db-status success">??DB?먯꽌 遺덈윭??/span>';

            setTimeout(() => { statusEl.innerHTML = ''; }, 3000);
        } else {
            statusEl.innerHTML = '<span class="db-status error">?좑툘 湲곕낯媛??ъ슜 以?/span>';
        }
    } catch (error) {
        console.error('DB Load Error:', error);
        statusEl.innerHTML = '<span class="db-status error">??DB ?곌껐 ?ㅽ뙣 (湲곕낯媛??ъ슜)</span>';
    }
}

// DB?먯꽌 遺덈윭??而ㅼ뒪? ??ぉ?ㅼ쓣 UI???뚮뜑留?
function renderCustomItemsFromDB() {
    const container = document.getElementById('custom-budget-items');
    container.innerHTML = ''; // 湲곗〈 ??ぉ ??젣
    customItemCount = 0;

    const customItems = BUDGET_CONFIG.costs.customItems || [];
    customItems.forEach(item => {
        addBudgetItemFromData(item.label, item.value, item.confirmed);
    });
}

// DB???덉궛 ?곗씠?????
async function saveBudgetToDB() {
    const statusEl = document.getElementById('db-status');
    const saveBtn = document.getElementById('save-budget-btn');

    try {
        saveBtn.disabled = true;
        saveBtn.textContent = '???以?..';
        statusEl.innerHTML = '<span class="db-status loading">?뱾 ???以?..</span>';

        const budgetData = {
            total_budget_per_person: BUDGET_CONFIG.totalBudgetPerPerson,
            costs: {
                ...BUDGET_CONFIG.costs,
                _meta: {
                    totalBudget: BUDGET_CONFIG.totalBudget,
                    personCount: BUDGET_CONFIG.personCount
                }
            },
            updated_at: new Date().toISOString()
        };

        // 癒쇱? PATCH ?쒕룄 (湲곗〈 ?덉퐫???낅뜲?댄듃)
        try {
            await supabaseRequest('budget', 'PATCH', budgetData);
        } catch (e) {
            // PATCH ?ㅽ뙣??POST濡????덉퐫???앹꽦
            await supabaseRequest('budget', 'POST', { id: 1, ...budgetData });
        }

        statusEl.innerHTML = '<span class="db-status success">??????꾨즺!</span>';
        setTimeout(() => { statusEl.innerHTML = ''; }, 3000);
    } catch (error) {
        console.error('DB Save Error:', error);
        statusEl.innerHTML = `< span class="db-status error" >??${error.message}</span > `;
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '?뮶 DB????ν븯湲?;
    }
}


// ?섏씠吏 濡쒕뱶???덉궛 ?낅뜲?댄듃 諛?吏??珥덇린??
document.addEventListener('DOMContentLoaded', async function () {
    // 癒쇱? DB?먯꽌 ?덉궛 ?곗씠??濡쒕뱶 ?쒕룄
    await loadBudgetFromDB();

    // 洹???紐⑤뱺 ?쒖떆 ?낅뜲?댄듃
    updateAllBudgetDisplays();
});

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 留?由ъ궗?댁쫰 (???꾪솚 ??源⑥쭚 諛⑹?)
    if (typeof refreshMaps === 'function') {
        setTimeout(refreshMaps, 100);
    }
}

// Matter.js Aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Body = Matter.Body,
    Constraint = Matter.Constraint;

let engine, render, runner;
let isRunning = false;
let rankings = [];
const colors = ['#FF6B00', '#2D9CDB', '#FFD700', '#4CAF50', '#9C27B0', '#E91E63', '#795548', '#607D8B'];

// ?띿뒪???뚮뜑留?
const renderText = function () {
    if (!render) return;
    const context = render.context;
    const bodies = Composite.allBodies(engine.world);

    context.font = "bold 12px Pretendard";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#fff";

    bodies.forEach(body => {
        if (body.label && !['peg', 'wall', 'ground', 'spinner', 'slope'].includes(body.label)) {
            const { x, y } = body.position;
            context.save();
            context.translate(x, y);
            context.fillText(body.label.substring(0, 3), 0, 0);
            context.restore();
        }
    });
};

function startMarbleRun() {
    const btn = document.getElementById('raceBtn');
    if (isRunning) {
        WorldClear();
        btn.textContent = 'START RUN';
        isRunning = false;
        return;
    }

    const nameInput = document.getElementById('rouletteNames').value;
    const names = nameInput.split(',').map(n => n.trim()).filter(n => n.length > 0);

    if (names.length < 2) {
        alert('理쒖냼 2紐??댁긽???대쫫???낅젰?댁＜?몄슂!');
        return;
    }

    const container = document.getElementById('matter-container');
    const rankList = document.getElementById('rankList');
    const board = document.getElementById('rankBoard');

    container.innerHTML = '';
    rankList.innerHTML = '';
    board.style.display = 'none';
    rankings = [];
    isRunning = true;
    btn.textContent = 'RESET';

    // 1. ?붿쭊
    engine = Engine.create();
    engine.world.gravity.y = 0.4; // 以묐젰 ?쎄컙 利앷? (留듭씠 湲몄뼱?몄꽌)

    // 2. ?뚮뜑??
    // CSS?먯꽌 height瑜?1200px濡??섎졇?쇰?濡? JS?먯꽌 ?대떦 ?ш린瑜??쎌뼱?????
    const width = container.offsetWidth;
    const height = container.offsetHeight; // Should be ~1200px

    render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: width,
            height: height,
            wireframes: false,
            background: '#222'
        }
    });

    // 3. 留?援ъ꽦 (4??肄붿뒪: ? -> ?뺢린??踰?-> 吏洹몄옱洹?-> 怨⑥씤)
    const wallOpts = { isStatic: true, render: { fillStyle: '#444' } };
    const pegOpts = { isStatic: true, render: { fillStyle: '#888' }, restitution: 0.5 };
    const bounceOpts = { isStatic: true, render: { fillStyle: '#E91E63' }, restitution: 1.6 }; // 媛뺣젰?섍쾶 ???踰?
    const glassOpts = { isStatic: true, render: { fillStyle: '#2D9CDB', opacity: 0.6 }, angle: Math.PI * 0.15 };

    // 醫뚯슦 踰?(?꾩껜 ?믪씠)
    Composite.add(engine.world, [
        Bodies.rectangle(0, height / 2, 20, height, wallOpts), // 醫뚮꼍
        Bodies.rectangle(width, height / 2, 20, height, wallOpts), // ?곕꼍
    ]);

    // [1援ш컙] ?곷떒 Plinko (?) - Start ~ 300px
    const startY = 100;
    for (let row = 0; row < 6; row++) {
        const cols = row % 2 === 0 ? 7 : 6;
        const spacingX = width / (cols + 1);
        for (let col = 1; col <= cols; col++) {
            Composite.add(engine.world, Bodies.circle(col * spacingX, startY + row * 45, 5, pegOpts));
        }
    }

    // [2援ш컙] 以묐떒 Bouncing Walls (?뺢린??踰? - 400px ~ 700px
    // 醫뚯슦?먯꽌 ??대굹???怨듭쓣 ?꾨줈/?놁쑝濡??뺢꺼??(Pinball Bumper ?먮굦)
    const bumperY = 500;
    Composite.add(engine.world, [
        // ?쇱そ 踰뷀띁 (?쇨컖??紐⑥뼇 鍮꾩듂?섍쾶)
        Bodies.polygon(width * 0.2, bumperY, 3, 40, { ...bounceOpts, angle: Math.PI / 2 }),
        Bodies.polygon(width * 0.1, bumperY + 100, 3, 50, { ...bounceOpts, angle: Math.PI / 4 }),

        // ?ㅻⅨ履?踰뷀띁
        Bodies.polygon(width * 0.8, bumperY + 50, 3, 40, { ...bounceOpts, angle: -Math.PI / 2.5 }),
        Bodies.polygon(width * 0.4, bumperY + 150, 3, 50, { ...bounceOpts, angle: -Math.PI / 4 }),

        // 以묒븰 ?뚯쟾 ?μ븷臾?
        Bodies.circle(width / 2, bumperY + 80, 25, { ...bounceOpts, label: 'spinner' })
    ]);


    // [3援ш컙] ?섎떒 ZigZags (吏洹몄옱洹??щ줈?? - 800px ~ 1100px
    const slopeY = 850;
    const slopeW = width * 0.6;
    const slopeH = 10;

    Composite.add(engine.world, [
        // ?쇱そ?먯꽌 ?ㅻⅨ履쎌쑝濡??대젮媛????
        Bodies.rectangle(width * 0.3, slopeY, slopeW, slopeH, { isStatic: true, angle: Math.PI * 0.15, render: { fillStyle: '#FFC107' } }),
        // ?ㅻⅨ履쎌뿉???쇱そ?쇰줈
        Bodies.rectangle(width * 0.7, slopeY + 150, slopeW, slopeH, { isStatic: true, angle: -Math.PI * 0.15, render: { fillStyle: '#FFC107' } }),
        // ?ㅼ떆 ?쇱そ?먯꽌 ?ㅻⅨ履?
        Bodies.rectangle(width * 0.3, slopeY + 300, slopeW, slopeH, { isStatic: true, angle: Math.PI * 0.1, render: { fillStyle: '#FFC107' } })
    ]);

    // [4援ш컙] ?쇰땲???쇱씤 媛?대뱶 (?섎떒 以묒븰?쇰줈 ?좊룄)
    Composite.add(engine.world, [
        Bodies.rectangle(width * 0.15, height - 150, width * 0.4, 20, { isStatic: true, angle: 0.3, render: { fillStyle: '#444' } }),
        Bodies.rectangle(width * 0.85, height - 150, width * 0.4, 20, { isStatic: true, angle: -0.3, render: { fillStyle: '#444' } })
    ]);

    // 4. 援ъ뒳 ?앹꽦
    const marbleRadius = 8;
    names.forEach((name, i) => {
        // x: ?붾㈃ ?덈퉬??30% ~ 70% ?ъ씠?먯꽌 ?쒕뜡 遺꾪룷
        const x = width * 0.3 + Math.random() * (width * 0.4);
        const y = -150; // ?숈떆??異쒕컻 (?믪씠 ?듭씪)

        const marble = Bodies.circle(x, y, marbleRadius, {
            restitution: 0.9,
            friction: 0.001,
            frictionAir: 0.02, // 怨듦린 ???(泥쒖쿇???⑥뼱吏?
            label: name,
            render: { fillStyle: colors[i % colors.length] }
        });
        Composite.add(engine.world, marble);
    });

    // 5. ?낅뜲?댄듃 & ?쇱꽌
    Events.on(render, 'afterRender', renderText);

    Events.on(engine, 'afterUpdate', function () {
        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
            // 援ъ뒳留?泥댄겕
            if (body.label && !['peg', 'wall', 'ground', 'spinner', 'slope'].includes(body.label)) {

                // ?뚯쟾 ?띿감 ?뚮━湲?(媛뺤젣 ?뚯쟾)
                if (body.label === 'spinner') {
                    Body.setAngularVelocity(body, 0.15);
                }

                // 諛붾떏 ?듦낵 (?쒓굅 & ??궧)
                if (body.position.y > height + 20) {
                    if (!rankings.includes(body.label)) {
                        rankings.push(body.label);
                        addRankItem(rankings.length, body.label);

                        // ?붾뱶?먯꽌 ?쒓굅 (?щ씪吏??④낵)
                        Composite.remove(engine.world, body);
                    }
                }
            }
        });
    });

    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);
}

function WorldClear() {
    if (render) {
        Render.stop(render);
        if (render.canvas) render.canvas.remove();
    }
    if (runner) Runner.stop(runner);
    if (engine) Engine.clear(engine);
    engine = null;
    render = null;
    runner = null;
}

function addRankItem(rank, name) {
    const board = document.getElementById('rankBoard');
    const list = document.getElementById('rankList');

    if (board.style.display === 'none') {
        board.style.display = 'block';
    }

    const item = document.createElement('div');
    item.className = 'rank-item';

    let medal = rank;
    if (rank === 1) medal = '?쪍 1st';
    else if (rank === 2) medal = '?쪎 2nd';
    else if (rank === 3) medal = '?쪏 3rd';
    else medal = rank + 'th';

    item.innerHTML = `<span>${medal}</span> <span>${name}</span>`;
    list.appendChild(item);
    board.scrollTop = board.scrollHeight;
}



// ?덉궛 ?좉툑?댁젣 ?⑥닔
let budgetUnlocked = false;
const BUDGET_PASSWORD = '901210';
let customItemCount = 0;

function unlockBudget() {
    if (!budgetUnlocked) {
        // ?좉툑 ?댁젣 ?쒕룄 -> 紐⑤떖 ?닿린
        openPasswordModal();
    } else {
        // ?좉툑 ?섍린
        toggleLockState(false);
    }
}

function openPasswordModal() {
    const modal = document.getElementById('password-modal');
    const input = document.getElementById('modal-password-input');
    if (modal) {
        modal.classList.add('show');
        input.value = '';
        setTimeout(() => input.focus(), 100); // ?쎄컙???쒕젅?????ъ빱??

        // ?뷀꽣???대깽??異붽?
        input.onkeydown = function (e) {
            if (e.key === 'Enter') submitPassword();
        };
    }
}

function closePasswordModal() {
    document.getElementById('password-modal').classList.remove('show');
}

function submitPassword() {
    const input = document.getElementById('modal-password-input');
    const password = input.value;

    if (password === BUDGET_PASSWORD) {
        toggleLockState(true);
        closePasswordModal();
    } else {
        alert('鍮꾨?踰덊샇媛 ??몄뒿?덈떎!');
        input.value = '';
        input.focus();
    }
}

function toggleLockState(unlock) {
    const inputs = document.querySelectorAll('.budget-input');
    const configInputs = document.querySelectorAll('.config-input');
    const btn = document.getElementById('unlock-btn');
    const status = document.getElementById('budget-status');
    const addBtn = document.getElementById('add-item-btn');
    const modalInput = document.getElementById('modal-password-input');

    const staticDeleteBtns = document.querySelectorAll('.static-delete-btn');

    if (unlock) {
        inputs.forEach(input => {
            if (input !== modalInput) input.disabled = false;
        });
        configInputs.forEach(input => input.disabled = false);
        btn.innerHTML = '?뵑 ?좉툑';
        status.textContent = '?륅툘 ?섏젙 媛?? 媛믪쓣 蹂寃쏀븯硫??먮룞 怨꾩궛?⑸땲??;
        addBtn.style.display = 'block';
        budgetUnlocked = true;
        staticDeleteBtns.forEach(b => b.style.display = 'inline-block');
    } else {
        inputs.forEach(input => {
            if (input !== modalInput) input.disabled = true;
        });
        configInputs.forEach(input => input.disabled = true);
        btn.innerHTML = '?뵏 ?좉툑?댁젣';
        status.textContent = '?뵏 ?섏젙?섎젮硫??좉툑?댁젣瑜??뚮윭二쇱꽭??;
        addBtn.style.display = 'none';
        budgetUnlocked = false;
        staticDeleteBtns.forEach(b => b.style.display = 'none');
    }

    // UI ?곹깭 ?숆린?붾? ?꾪빐 ?덉궛 怨꾩궛 ?⑥닔 ?몄텧 (而ㅼ뒪? ??ぉ ??젣 踰꾪듉 ?쒖떆 ??
    onBudgetChange();
}

function addBudgetItem() {
    addBudgetItemFromData('', 0, false);
}

function addBudgetItemFromData(label, value, confirmed) {
    customItemCount++;
    const container = document.getElementById('custom-budget-items');
    const itemId = `custom-item-${customItemCount}`;

    const row = document.createElement('div');
    row.className = 'budget-input-row';
    row.id = itemId;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'custom-confirmed';
    checkbox.checked = confirmed;
    checkbox.style.cssText = "width:20px; height:20px; margin-right:8px; accent-color:#4CAF50;";
    checkbox.onchange = onBudgetChange;

    // Label Input
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.className = 'budget-label-input';
    labelInput.placeholder = '??ぉ紐?;
    labelInput.value = label;
    labelInput.style.cssText = "flex:1; padding:8px; border:1px solid #ddd; border-radius:8px; font-size:0.9rem;";
    labelInput.oninput = onBudgetChange;

    // ?섏젙 紐⑤뱶 ?꾪솚
    labelInput.onclick = function () {
        if (checkbox.checked) {
            if (confirm('????ぉ???섏젙?섏떆寃좎뒿?덇퉴?')) {
                checkbox.checked = false;
                onBudgetChange();
            }
        }
    };

    // Cost Input
    const costInput = document.createElement('input');
    costInput.type = 'number';
    costInput.className = 'budget-input custom-cost';
    costInput.value = value;
    costInput.oninput = onBudgetChange;

    // Unit
    const unitSpan = document.createElement('span');
    unitSpan.className = 'budget-unit';
    unitSpan.textContent = '??;

    row.appendChild(checkbox);
    row.appendChild(labelInput);
    row.appendChild(costInput);
    row.appendChild(unitSpan);

    // ?ㅼ??댄봽 湲곕뒫 異붽?
    addSwipeListeners(row);

    container.appendChild(row);
    onBudgetChange();
}


function removeBudgetItem(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
        onBudgetChange();
        return true;
    }
    return false;
}

function removeStaticItem(rowId) {
    const item = document.getElementById(rowId);
    if (item) {
        if (confirm('????ぉ???뺣쭚 ??젣?섏떆寃좎뒿?덇퉴? (??젣??媛믪? 0?먯쑝濡?怨꾩궛?⑸땲??')) {
            item.remove();
            onBudgetChange();
            return true;
        }
    }
    return false;
}

// ==========================================
// ?몘 Swipe to Delete Logic
// ==========================================
function addSwipeListeners(row) {
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    // Touch Events
    row.addEventListener('touchstart', (e) => startSwipe(e.touches[0].clientX));
    row.addEventListener('touchmove', (e) => moveSwipe(e, e.touches[0].clientX));
    row.addEventListener('touchend', (e) => endSwipe());

    // Mouse Events (Test/Desktop)
    row.addEventListener('mousedown', (e) => startSwipe(e.clientX));
    row.addEventListener('mousemove', (e) => { if (isSwiping) moveSwipe(e, e.clientX); });
    row.addEventListener('mouseup', (e) => { if (isSwiping) endSwipe(); });
    row.addEventListener('mouseleave', (e) => { if (isSwiping) endSwipe(); });

    function startSwipe(x) {
        if (!budgetUnlocked) return; // ?좉툑 ?곹깭硫??숈옉 ?덊븿
        isSwiping = true;
        startX = x;
        row.classList.add('swiping'); // Disable transition
    }

    function moveSwipe(e, x) {
        if (!isSwiping) return;
        currentX = x - startX;

        // ?섏쭅 ?ㅽ겕濡?諛⑺빐 理쒖냼?? X異??대룞???묒쑝硫?臾댁떆? 
        // CSS touch-action: pan-y 泥섎━??

        // ?대룞 ?쒗븳 (?덈Т 硫由??덇?寃? ?뱀? ?먯쑀濡?쾶)
        row.style.transform = `translateX(${currentX}px)`;

        // ?쒓컖???쇰뱶諛?(諛곌꼍??蹂寃??? - ?ш린?쒕뒗 CSS濡?泥섎━?섍굅??蹂듭옟????땄
    }

    function endSwipe() {
        if (!isSwiping) return;
        isSwiping = false;
        row.classList.remove('swiping');

        const threshold = 100; // ??젣 湲곗? 嫄곕━

        if (Math.abs(currentX) > threshold) {
            // ??젣 ?≪뀡
            const direction = currentX > 0 ? 1 : -1;
            const endX = direction * window.innerWidth; // ?붾㈃ 諛뽰쑝濡?

            row.style.transform = `translateX(${endX}px)`;
            row.classList.add('deleting');

            // ?좊땲硫붿씠???쒓컙 ???ㅼ젣 ??젣 泥섎━
            setTimeout(() => {
                let deleted = false;
                // Static Item?몄? Custom Item?몄? 援щ텇
                // Static Item? ID媛 row-... ?뺤떇
                if (row.id.startsWith('row-')) {
                    deleted = removeStaticItem(row.id);
                } else {
                    deleted = removeBudgetItem(row.id);
                }

                if (!deleted) {
                    // ??젣 痍⑥냼??(Static Item confirm 痍⑥냼??
                    cancelDelete();
                }
            }, 300); // CSS transition time match

        } else {
            // ?쒖옄由?蹂듦?
            cancelDelete();
        }
    }

    function cancelDelete() {
        row.classList.remove('deleting');
        row.style.transform = 'translateX(0)';
    }
}


// ?ㅼ젙 蹂寃?(珥??덉궛 / ?몄썝)
function onConfigChange() {
    const totalInput = document.getElementById('config-total-budget');
    const personInput = document.getElementById('config-person-count');

    const newTotal = parseInt(totalInput.value) || 0;
    const newPerson = parseInt(personInput.value) || 1;

    BUDGET_CONFIG.totalBudget = newTotal;
    BUDGET_CONFIG.personCount = newPerson;
    BUDGET_CONFIG.totalBudgetPerPerson = Math.floor(newTotal / newPerson);

    updateAllBudgetDisplays();
}

// ?덉궛 怨꾩궛 ?⑥닔 (?덉궛 怨꾩궛湲곗뿉??媛?蹂寃쎌떆)
function onBudgetChange() {
    // BUDGET_CONFIG ?낅뜲?댄듃 (Safe access with optional chaining)
    BUDGET_CONFIG.costs.flight = parseInt(document.getElementById('cost-flight')?.value) || 0;
    BUDGET_CONFIG.costs.rent = parseInt(document.getElementById('cost-rent')?.value) || 0;
    BUDGET_CONFIG.costs.day1Dinner = parseInt(document.getElementById('cost-day1-dinner')?.value) || 0;
    BUDGET_CONFIG.costs.park981 = parseInt(document.getElementById('cost-981')?.value) || 0;
    BUDGET_CONFIG.costs.day2Lunch = parseInt(document.getElementById('cost-day2-lunch')?.value) || 0;
    BUDGET_CONFIG.costs.day2Cafe = parseInt(document.getElementById('cost-day2-tour')?.value) || 0;
    BUDGET_CONFIG.costs.day2Dinner = parseInt(document.getElementById('cost-day2-dinner')?.value) || 0;

    // 而ㅼ뒪? ??ぉ??怨꾩궛 (諛곗뿴濡????
    const customRows = document.querySelectorAll('#custom-budget-items .budget-input-row');
    let customTotal = 0;
    const customItems = [];
    customRows.forEach((row) => {
        const labelInput = row.querySelector('.budget-label-input');
        const costInput = row.querySelector('.custom-cost');
        const confirmedInput = row.querySelector('.custom-confirmed');

        const label = labelInput ? labelInput.value || '' : '';
        const value = parseInt(costInput?.value) || 0;
        const confirmed = confirmedInput ? confirmedInput.checked : false;

        customItems.push({ label, value, confirmed });
        customTotal += value;

        // ?뺤젙????ぉ UI ?낅뜲?댄듃 (?뚯깋泥섎━, 鍮꾪솢?깊솕) - ??젣 踰꾪듉 濡쒖쭅 ?쒓굅??
        if (confirmed) {
            // Label Styling: ?띿뒪?몄쿂??蹂댁씠寃?
            if (labelInput) {
                labelInput.disabled = true;
                labelInput.style.border = 'none';
                labelInput.style.background = 'transparent';
                labelInput.style.padding = '0';
                labelInput.style.fontWeight = '500';
                labelInput.style.color = 'var(--text-main)';
                labelInput.style.cursor = 'pointer';
            }
            if (confirmedInput) confirmedInput.style.display = 'none';
            if (costInput) costInput.disabled = true;

            // Row styling (Standard look)
            row.style.background = '#f8f9fa';
            row.style.border = '1px solid #e5e8eb';

        } else {
            // ?섏젙 紐⑤뱶: ?ㅽ???蹂듭썝
            if (labelInput) {
                labelInput.disabled = false;
                labelInput.style.border = '1px solid #ddd';
                labelInput.style.background = 'white';
                labelInput.style.padding = '8px';
                labelInput.style.fontWeight = '400';
                labelInput.style.color = 'black';
                labelInput.style.cursor = 'text';
            }
            if (confirmedInput) confirmedInput.style.display = 'inline-block';
            if (costInput) costInput.disabled = false;

            // Row styling (Edit look)
            row.style.background = '#fff';
            row.style.border = '1px solid #2D9CDB'; // Blue border for focus
        }
    });

    BUDGET_CONFIG.costs.customItems = customItems;
    BUDGET_CONFIG.costs.customTotal = customTotal;

    updateAllBudgetDisplays();
}

// ?섏씠吏 濡쒕뱶???덉궛 ?낅뜲?댄듃 諛?珥덇린??
document.addEventListener('DOMContentLoaded', async function () {
    // 1. DB 濡쒕뱶
    await loadBudgetFromDB();

    // 2. Static Rows???ㅼ??댄봽 由ъ뒪??異붽?
    const staticIds = [
        'row-flight', 'row-rent', 'row-day1-dinner', 'row-whiskey',
        'row-981', 'row-day2-lunch', 'row-day2-tour', 'row-day2-dinner'
    ];
    staticIds.forEach(id => {
        const row = document.getElementById(id);
        if (row) addSwipeListeners(row);
    });

    // 3. UI ?낅뜲?댄듃
    updateAllBudgetDisplays();

    // 4. 吏??珥덇린??(?쎄컙???쒕젅?????ㅽ뻾?섏뿬 ???뚮뜑留??덉젙??
    setTimeout(initMaps, 500);
});
