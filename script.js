
// ========================================
// 💰 예산 중앙 관리 시스템
// ========================================
const BUDGET_CONFIG = {
    totalBudget: 3500000, // 총 예산
    personCount: 10,      // 인원 수
    totalBudgetPerPerson: 350000, // 1인당 예산 (자동계산)
    costs: {
        flight: 100000,      // 항공권
        rent: 40000,         // 렌트+기름
        day1Dinner: 50000,   // Day1 저녁 (신우성 흑돼지)
        whiskey: 20000,      // 양주 (20만원/10명)
        day2Lunch: 24000,    // Day2 점심
        park981: 37000,      // Day2 9.81파크
        day2Cafe: 8000,      // Day2 카페
        day2Dinner: 40000    // Day2 저녁 (올레시장)
    }
};

// Day별 비용 계산
function calcDayBudgets() {
    const c = BUDGET_CONFIG.costs;
    const customTotal = c.customTotal || 0;
    const day1 = c.flight + c.rent + c.day1Dinner + c.whiskey;
    const day2 = c.day2Lunch + c.park981 + c.day2Cafe + c.day2Dinner;
    const day3 = customTotal; // 커스텀 항목은 Day3에 표시
    const total = day1 + day2 + day3;
    // 총 예산에서 모든 비용 차감 (단순 계산)
    const remaining = BUDGET_CONFIG.totalBudgetPerPerson - total;

    return {
        day1: { cost: day1, cumulative: day1, remaining: BUDGET_CONFIG.totalBudgetPerPerson - day1 },
        day2: { cost: day2, cumulative: day1 + day2, remaining: BUDGET_CONFIG.totalBudgetPerPerson - day1 - day2 },
        day3: { cost: day3, cumulative: total, remaining: remaining },
        total: total,
        remaining: remaining
    };
}

// 금액 포맷 (만원 단위)
function formatWon(amount) {
    if (amount >= 10000) {
        const man = amount / 10000;
        return man % 1 === 0 ? `${man} 만원` : `${man.toFixed(1)} 만원`;
    }
    return `${amount.toLocaleString()} 원`;
}

// 모든 예산 표시 업데이트
function updateAllBudgetDisplays() {
    const budgets = calcDayBudgets();

    // [NEW] 전역 예산 정보 텍스트 업데이트
    const totalMan = (BUDGET_CONFIG.totalBudget / 10000).toFixed(0);
    const perPersonMan = (BUDGET_CONFIG.totalBudgetPerPerson / 10000).toFixed(0);
    const count = BUDGET_CONFIG.personCount;

    // Header 인원
    const headerPerson = document.getElementById('header-person-count');
    if (headerPerson) headerPerson.textContent = count;

    // Day1 Info Box
    const day1Info = document.getElementById('day1-info-box');
    if (day1Info) {
        day1Info.innerHTML = `💡 총 예산 ${totalMan}만원 (1인 ${perPersonMan}만원) | 항공 + 렌트/기름 포함<br>🏠 숙소비: 1인 2만원 (별도, 예산 미포함) - 이재환 선임에게 2만원 입금 🙏`;
    }

    // Info Tab Per Person
    const infoPerPerson = document.getElementById('info-per-person-budget');
    if (infoPerPerson) infoPerPerson.textContent = BUDGET_CONFIG.totalBudgetPerPerson.toLocaleString() + '원';

    // Info Tab Footer
    const footerInfo = document.getElementById('info-footer-box');
    if (footerInfo) {
        footerInfo.textContent = `숙소: 1인 2만원 (이재환 선임에게 2만원 입금) | 총 예산: ${totalMan}만원 (${count}명)`;
    }

    // 예산 기준 텍스트
    const calcCriteria = document.getElementById('calc-criteria');
    if (calcCriteria) calcCriteria.textContent = perPersonMan + '만원';

    // [NEW] Static Budget Texts Update (IDs & Data attributes)
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    const c = BUDGET_CONFIG.costs;

    // IDs
    setText('disp-flight', `항공 1인 ${(c.flight / 10000).toFixed(0)}만원`);
    setText('disp-rent', `렌트+기름 1인 ${(c.rent / 10000).toFixed(0)}만원`);
    setText('disp-rent-total', `💰 총 ${(c.rent * count / 10000).toFixed(0)}만원 (${count}명 기준)`);
    setText('disp-day1-dinner-opt', `인당 ${(c.day1Dinner / 10000).toFixed(0)}만원`);
    setText('disp-whiskey-total', `🍷 양주 구매 예정 (총 ${(c.whiskey * count / 10000).toFixed(0)}만원)`);
    setText('disp-day2-dinner-opt', `인당 ${(c.day2Dinner / 10000).toFixed(0)}만원`);

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

    // Day 1 예산바
    const day1Cost = document.getElementById('day1-cost');
    const day1Total = document.getElementById('day1-total');
    const day1Remain = document.getElementById('day1-remain');
    if (day1Cost) day1Cost.textContent = '~' + formatWon(budgets.day1.cost);
    if (day1Total) day1Total.textContent = '~' + formatWon(budgets.day1.cumulative);
    if (day1Remain) day1Remain.textContent = '~' + formatWon(budgets.day1.remaining);

    // Day 2 예산바
    const day2Cost = document.getElementById('day2-cost');
    const day2Total = document.getElementById('day2-total');
    const day2Remain = document.getElementById('day2-remain');
    if (day2Cost) day2Cost.textContent = '~' + formatWon(budgets.day2.cost);
    if (day2Total) day2Total.textContent = '~' + formatWon(budgets.day2.cumulative);
    if (day2Remain) day2Remain.textContent = '~' + formatWon(budgets.day2.remaining);

    // Day 3 예산바
    const day3Cost = document.getElementById('day3-cost');
    const day3Total = document.getElementById('day3-total');
    const day3Remain = document.getElementById('day3-remain');
    if (day3Cost) day3Cost.textContent = formatWon(budgets.day3.cost);
    if (day3Total) day3Total.textContent = '~' + formatWon(budgets.day3.cumulative);
    if (day3Remain) day3Remain.textContent = '~' + formatWon(budgets.day3.remaining);

    // Info 페이지 예산 계산기
    const totalCost = document.getElementById('total-cost');
    const remainingBudget = document.getElementById('remaining-budget');
    if (totalCost) totalCost.textContent = budgets.total.toLocaleString() + '원';
    if (remainingBudget) {
        if (budgets.remaining >= 0) {
            remainingBudget.textContent = '+' + budgets.remaining.toLocaleString() + '원 여유';
            remainingBudget.style.color = '#4CAF50';
        } else {
            remainingBudget.textContent = budgets.remaining.toLocaleString() + '원 초과';
            remainingBudget.style.color = '#E91E63';
        }
    }

    // 예산 계산기 input 기본값 동기화
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
// 🔗 Supabase DB API 연동
// ========================================
const SUPABASE_URL = 'https://oiyzxdrssxobsqjtlyjf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peXp4ZHJzc3hvYnNxanRseWpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5NTUxMSwiZXhwIjoyMDg0MDcxNTExfQ.DAu3egzVedYCLLIZNL3toSl72EyuEnMGjqWgslPsXq4';

// Supabase REST API 호출 헬퍼
async function supabaseRequest(table, method = 'GET', body = null, select = '*') {
    const headers = {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    };

    // JWT 키(ey...)인 경우에만 Bearer 인증 헤더 추가
    if (SUPABASE_KEY.startsWith('ey')) {
        headers['Authorization'] = `Bearer ${SUPABASE_KEY}`;
    }

    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    if (method === 'GET') {
        url += `?select=${select}&order=updated_at.desc&limit=1`;
    }
    if (method === 'PATCH') {
        url += '?id=eq.1'; // 항상 id=1 레코드 업데이트
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Supabase error: ${response.status}`);
    }
    return method === 'GET' ? response.json() : response;
}

// DB에서 예산 데이터 로드
async function loadBudgetFromDB() {
    const statusEl = document.getElementById('db-status');
    try {
        statusEl.innerHTML = '<span class="db-status loading">📡 DB 연결 중...</span>';

        const data = await supabaseRequest('budget');

        if (data && data.length > 0) {
            const budgetData = data[0];
            // BUDGET_CONFIG 업데이트
            if (budgetData.costs) {
                // 메타 데이터(총예산/인원) 복원
                if (budgetData.costs._meta) {
                    BUDGET_CONFIG.totalBudget = budgetData.costs._meta.totalBudget;
                    BUDGET_CONFIG.personCount = budgetData.costs._meta.personCount;
                    // 1인당 예산 재계산
                    BUDGET_CONFIG.totalBudgetPerPerson = Math.floor(BUDGET_CONFIG.totalBudget / BUDGET_CONFIG.personCount);
                } else if (budgetData.total_budget_per_person) {
                    // 메타 없이 1인당 예산만 있는 경우 (구버전 호환)
                    BUDGET_CONFIG.totalBudgetPerPerson = budgetData.total_budget_per_person;
                    BUDGET_CONFIG.totalBudget = BUDGET_CONFIG.totalBudgetPerPerson * BUDGET_CONFIG.personCount;
                }

                // 비용 데이터 복사
                Object.assign(BUDGET_CONFIG.costs, budgetData.costs);

                // [NEW] 맵 데이터 로드
                if (budgetData.costs.mapData) {
                    if (budgetData.costs.mapData.locations) {
                        Object.assign(LOCATIONS, budgetData.costs.mapData.locations);
                    }
                    if (budgetData.costs.mapData.routes) {
                        Object.assign(ROUTES, budgetData.costs.mapData.routes);
                    }
                    // 지도 초기화 (데이터 로드 후)
                    if (typeof initMaps === 'function') initMaps();
                }
            }

            // 커스텀 항목들 UI에 렌더링
            renderCustomItemsFromDB();

            updateAllBudgetDisplays();
            statusEl.innerHTML = '<span class="db-status success">✅ DB에서 불러옴</span>';

            setTimeout(() => { statusEl.innerHTML = ''; }, 3000);
        } else {
            statusEl.innerHTML = '<span class="db-status error">⚠️ 기본값 사용 중</span>';
        }
    } catch (error) {
        console.error('DB Load Error:', error);
        statusEl.innerHTML = '<span class="db-status error">❌ DB 연결 실패 (기본값 사용)</span>';
    }
}

// DB에서 불러온 커스텀 항목들을 UI에 렌더링
function renderCustomItemsFromDB() {
    const container = document.getElementById('custom-budget-items');
    container.innerHTML = ''; // 기존 항목 삭제
    customItemCount = 0;

    const customItems = BUDGET_CONFIG.costs.customItems || [];
    customItems.forEach(item => {
        addBudgetItemFromData(item.label, item.value, item.confirmed);
    });
}

// DB에 예산 데이터 저장
async function saveBudgetToDB() {
    const statusEl = document.getElementById('db-status');
    const saveBtn = document.getElementById('save-budget-btn');

    try {
        saveBtn.disabled = true;
        saveBtn.textContent = '저장 중...';
        statusEl.innerHTML = '<span class="db-status loading">📤 저장 중...</span>';

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

        // 먼저 PATCH 시도 (기존 레코드 업데이트)
        try {
            await supabaseRequest('budget', 'PATCH', budgetData);
        } catch (e) {
            // PATCH 실패시 POST로 새 레코드 생성
            await supabaseRequest('budget', 'POST', { id: 1, ...budgetData });
        }

        statusEl.innerHTML = '<span class="db-status success">✅ 저장 완료!</span>';
        setTimeout(() => { statusEl.innerHTML = ''; }, 3000);
    } catch (error) {
        console.error('DB Save Error:', error);
        statusEl.innerHTML = `<span class="db-status error">❌ ${error.message}</span>`;
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 DB에 저장하기';
    }
}


// 페이지 로드시 예산 업데이트 및 지도 초기화
document.addEventListener('DOMContentLoaded', async function () {
    // 먼저 DB에서 예산 데이터 로드 시도
    await loadBudgetFromDB();

    // 그 후 모든 표시 업데이트
    // 그 후 모든 표시 업데이트
    updateAllBudgetDisplays();

    // 초기 상태에서 저장 버튼 비활성화 (잠금 상태이므로)
    const saveBtn = document.getElementById('save-budget-btn');
    if (saveBtn) saveBtn.disabled = true;
});

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 맵 리사이즈 (탭 전환 시 깨짐 방지)
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

// 텍스트 렌더링
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
        alert('최소 2명 이상의 이름을 입력해주세요!');
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

    // 1. 엔진
    engine = Engine.create();
    engine.world.gravity.y = 0.4; // 중력 약간 증가 (맵이 길어져서)

    // 2. 렌더러
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

    // 3. 맵 구성 (4단 코스: 핀 -> 튕기는 벽 -> 지그재그 -> 골인)
    const wallOpts = { isStatic: true, render: { fillStyle: '#444' } };
    const pegOpts = { isStatic: true, render: { fillStyle: '#888' }, restitution: 0.5 };
    const bounceOpts = { isStatic: true, render: { fillStyle: '#E91E63' }, restitution: 1.6 }; // 강력하게 튀는 벽
    const glassOpts = { isStatic: true, render: { fillStyle: '#2D9CDB', opacity: 0.6 }, angle: Math.PI * 0.15 };

    // 좌우 벽 (전체 높이)
    Composite.add(engine.world, [
        Bodies.rectangle(0, height / 2, 20, height, wallOpts), // 좌벽
        Bodies.rectangle(width, height / 2, 20, height, wallOpts), // 우벽
    ]);

    // [1구간] 상단 Plinko (핀) - Start ~ 300px
    const startY = 100;
    for (let row = 0; row < 6; row++) {
        const cols = row % 2 === 0 ? 7 : 6;
        const spacingX = width / (cols + 1);
        for (let col = 1; col <= cols; col++) {
            Composite.add(engine.world, Bodies.circle(col * spacingX, startY + row * 45, 5, pegOpts));
        }
    }

    // [2구간] 중단 Bouncing Walls (튕기는 벽) - 400px ~ 700px
    const bumperY = 500;
    Composite.add(engine.world, [
        // 왼쪽 범퍼 (삼각형 모양 비슷하게)
        Bodies.polygon(width * 0.2, bumperY, 3, 40, { ...bounceOpts, angle: Math.PI / 2 }),
        Bodies.polygon(width * 0.1, bumperY + 100, 3, 50, { ...bounceOpts, angle: Math.PI / 4 }),

        // 오른쪽 범퍼
        Bodies.polygon(width * 0.8, bumperY + 50, 3, 40, { ...bounceOpts, angle: -Math.PI / 2.5 }),
        Bodies.polygon(width * 0.4, bumperY + 150, 3, 50, { ...bounceOpts, angle: -Math.PI / 4 }),

        // 중앙 회전 장애물
        Bodies.circle(width / 2, bumperY + 80, 25, { ...bounceOpts, label: 'spinner' })
    ]);


    // [3구간] 하단 ZigZags (지그재그 슬로프) - 800px ~ 1100px
    const slopeY = 850;
    const slopeW = width * 0.6;
    const slopeH = 10;

    Composite.add(engine.world, [
        // 왼쪽에서 오른쪽으로 내려가는 판
        Bodies.rectangle(width * 0.3, slopeY, slopeW, slopeH, { isStatic: true, angle: Math.PI * 0.15, render: { fillStyle: '#FFC107' } }),
        // 오른쪽에서 왼쪽으로
        Bodies.rectangle(width * 0.7, slopeY + 150, slopeW, slopeH, { isStatic: true, angle: -Math.PI * 0.15, render: { fillStyle: '#FFC107' } }),
        // 다시 왼쪽에서 오른쪽
        Bodies.rectangle(width * 0.3, slopeY + 300, slopeW, slopeH, { isStatic: true, angle: Math.PI * 0.1, render: { fillStyle: '#FFC107' } })
    ]);

    // [4구간] 피니시 라인 가이드 (하단 중앙으로 유도)
    Composite.add(engine.world, [
        Bodies.rectangle(width * 0.15, height - 150, width * 0.4, 20, { isStatic: true, angle: 0.3, render: { fillStyle: '#444' } }),
        Bodies.rectangle(width * 0.85, height - 150, width * 0.4, 20, { isStatic: true, angle: -0.3, render: { fillStyle: '#444' } })
    ]);

    // 4. 구슬 생성
    const marbleRadius = 8;
    names.forEach((name, i) => {
        // x: 화면 너비의 30% ~ 70% 사이에서 랜덤 분포
        const x = width * 0.3 + Math.random() * (width * 0.4);
        const y = -150; // 동시에 출발 (높이 통일)

        const marble = Bodies.circle(x, y, marbleRadius, {
            restitution: 0.9,
            friction: 0.001,
            frictionAir: 0.02, // 공기 저항 (천천히 떨어짐)
            label: name,
            render: { fillStyle: colors[i % colors.length] }
        });
        Composite.add(engine.world, marble);
    });

    // 5. 업데이트 & 센서
    Events.on(render, 'afterRender', renderText);

    Events.on(engine, 'afterUpdate', function () {
        const bodies = Composite.allBodies(engine.world);
        bodies.forEach(body => {
            // 구슬만 체크
            if (body.label && !['peg', 'wall', 'ground', 'spinner', 'slope'].includes(body.label)) {

                // 회전 풍차 돌리기 (강제 회전)
                if (body.label === 'spinner') {
                    Body.setAngularVelocity(body, 0.15);
                }

                // 바닥 통과 (제거 & 랭킹)
                if (body.position.y > height + 20) {
                    if (!rankings.includes(body.label)) {
                        rankings.push(body.label);
                        addRankItem(rankings.length, body.label);

                        // 월드에서 제거 (사라짐 효과)
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
    if (rank === 1) medal = '🥇 1st';
    else if (rank === 2) medal = '🥈 2nd';
    else if (rank === 3) medal = '🥉 3rd';
    else medal = rank + 'th';

    item.innerHTML = `<span>${medal}</span> <span>${name}</span>`;
    list.appendChild(item);
    board.scrollTop = board.scrollHeight;
}



// 예산 잠금해제 함수
let budgetUnlocked = false;
const BUDGET_PASSWORD = '901210';
let customItemCount = 0;

function unlockBudget() {
    if (!budgetUnlocked) {
        // 잠금 해제 시도 -> 모달 열기
        openPasswordModal();
    } else {
        // 잠금 하기
        toggleLockState(false);
    }
}

function openPasswordModal() {
    const modal = document.getElementById('password-modal');
    const input = document.getElementById('modal-password-input');
    if (modal) {
        modal.classList.add('show');
        input.value = '';
        setTimeout(() => input.focus(), 100); // 약간의 딜레이 후 포커스

        // 엔터키 이벤트 추가
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
        alert('비밀번호가 틀렸습니다!');
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
    const saveBtn = document.getElementById('save-budget-btn');

    if (unlock) {
        inputs.forEach(input => {
            if (input !== modalInput) input.disabled = false;
        });
        configInputs.forEach(input => input.disabled = false);
        btn.innerHTML = '🔓 잠금';
        status.textContent = '✏️ 수정 가능! 값을 변경하면 자동 계산됩니다';
        addBtn.style.display = 'block';
        budgetUnlocked = true;
        staticDeleteBtns.forEach(b => b.style.display = 'inline-block');
        if (saveBtn) saveBtn.disabled = false; // Enable Save Button
    } else {
        inputs.forEach(input => {
            if (input !== modalInput) input.disabled = true;
        });
        configInputs.forEach(input => input.disabled = true);
        btn.innerHTML = '🔒 잠금해제';
        status.textContent = '🔒 수정하려면 잠금해제를 눌러주세요';
        addBtn.style.display = 'none';
        budgetUnlocked = false;
        staticDeleteBtns.forEach(b => b.style.display = 'none');
        if (saveBtn) saveBtn.disabled = true; // Disable Save Button
    }

    // UI 상태 동기화를 위해 예산 계산 함수 호출 (커스텀 항목 삭제 버튼 표시 등)
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
    labelInput.placeholder = '항목명';
    labelInput.value = label;
    labelInput.style.cssText = "flex:1; padding:8px; border:1px solid #ddd; border-radius:8px; font-size:0.9rem;";
    labelInput.oninput = onBudgetChange;

    // 수정 모드 전환
    labelInput.onclick = function () {
        if (checkbox.checked) {
            if (confirm('이 항목을 수정하시겠습니까?')) {
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
    unitSpan.textContent = '원';

    row.appendChild(checkbox);
    row.appendChild(labelInput);
    row.appendChild(costInput);
    row.appendChild(unitSpan);

    // 스와이프 기능 추가
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
        if (confirm('이 항목을 정말 삭제하시겠습니까? (삭제후 값은 0원으로 계산됩니다)')) {
            item.remove();
            onBudgetChange();
            return true;
        }
    }
    return false;
}

// ==========================================
// 👆 Swipe to Delete Logic
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
        if (!budgetUnlocked) return; // 잠금 상태면 동작 안함
        isSwiping = true;
        startX = x;
        row.classList.add('swiping'); // Disable transition
    }

    function moveSwipe(e, x) {
        if (!isSwiping) return;
        currentX = x - startX;

        // 수직 스크롤 방해 최소화: X축 이동이 작으면 무시
        // CSS touch-action: pan-y 처리됨.

        // 이동 제한 (너무 멀리 안가게)
        row.style.transform = `translateX(${currentX}px)`;

        // 시각적 피드백 (배경색 변경 등) - CSS로 처리
    }

    function endSwipe() {
        if (!isSwiping) return;
        isSwiping = false;
        row.classList.remove('swiping');

        const threshold = 100; // 삭제 기준 거리

        if (Math.abs(currentX) > threshold) {
            // 삭제 액션
            const direction = currentX > 0 ? 1 : -1;
            const endX = direction * window.innerWidth; // 화면 밖으로

            row.style.transform = `translateX(${endX}px)`;
            row.style.opacity = '0';
            row.style.transition = 'all 0.3s ease-out';

            setTimeout(() => {
                // 실제 DOM 삭제 (static item인지 custom item인지 구분)
                if (row.id.startsWith('custom-item-')) {
                    removeBudgetItem(row.id);
                } else if (row.id.startsWith('row-') || row.id.startsWith('budget-')) {
                    // 정적 아이템 삭제 로직 처리
                    removeStaticItem(row.id);
                } else {
                    // 기타
                    row.remove();
                }
                onBudgetChange();
            }, 300);
        } else {
            // 제자리 복귀
            cancelDelete();
        }
    }

    function cancelDelete() {
        row.classList.remove('deleting');
        row.style.transform = 'translateX(0)';
    }
}


// 설정 변경 (총 예산 / 인원)
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

// 예산 계산 함수 (예산 계산기에서 값 변경시)
function onBudgetChange() {
    // BUDGET_CONFIG 업데이트 (Safe access with optional chaining)
    BUDGET_CONFIG.costs.flight = parseInt(document.getElementById('cost-flight')?.value) || 0;
    BUDGET_CONFIG.costs.rent = parseInt(document.getElementById('cost-rent')?.value) || 0;
    BUDGET_CONFIG.costs.day1Dinner = parseInt(document.getElementById('cost-day1-dinner')?.value) || 0;
    BUDGET_CONFIG.costs.park981 = parseInt(document.getElementById('cost-981')?.value) || 0;
    BUDGET_CONFIG.costs.day2Lunch = parseInt(document.getElementById('cost-day2-lunch')?.value) || 0;
    BUDGET_CONFIG.costs.day2Cafe = parseInt(document.getElementById('cost-day2-tour')?.value) || 0;
    BUDGET_CONFIG.costs.day2Dinner = parseInt(document.getElementById('cost-day2-dinner')?.value) || 0;

    // 커스텀 항목들 계산 (배열로 저장)
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

        // 확정된 항목 UI 업데이트 (회색처리, 비활성화) - 삭제 버튼 로직 제거됨
        if (confirmed) {
            // Label Styling: 텍스트처럼 보이게
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
            // 수정 모드: 스타일 복원
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

// 페이지 로드시 예산 업데이트 및 초기화
document.addEventListener('DOMContentLoaded', async function () {
    // 1. DB 로드
    await loadBudgetFromDB();

    // 2. Static Rows에 스와이프 리스너 추가
    const staticIds = [
        'row-flight', 'row-rent', 'row-day1-dinner', 'row-whiskey',
        'row-981', 'row-day2-lunch', 'row-day2-tour', 'row-day2-dinner'
    ];
    staticIds.forEach(id => {
        const row = document.getElementById(id);
        if (row) addSwipeListeners(row);
    });

    // 3. UI 업데이트
    updateAllBudgetDisplays();

    // 4. 지도 초기화 (약간의 딜레이 후 실행하여 탭 렌더링 안정화)
    setTimeout(initMaps, 500);
});


// ========================================
// 🎮 게임 전환 (Marble <-> Car)
// ========================================
function switchGame(gameId, btn) {
    // 1. 모든 게임 컨테이너 숨기기
    document.querySelectorAll('.game-container').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active');
    });

    // 2. 선택된 게임 보이기
    const target = document.getElementById(`game-${gameId}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }

    // 3. 버튼 활성화 상태 변경
    document.querySelectorAll('.toggle-btn').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');

    // 4. 타이틀 변경
    const title = document.getElementById('rec-title');
    if (title) {
        title.textContent = gameId === 'marble' ? '🎱 순서 정하기' : '🚗 차량 좌석 배치';
    }
}


// ========================================
// 🚗 차량 배치 로직
// ========================================
function assignCars() {
    const fixedDrivers = ['김지섭', '신우성'];
    const allMembers = ['김지섭', '박범진', '손영길', '신예리', '신우성', '이재환', '임혜정', '장민한', '조옥래', '홍예진'];
    let passengers = allMembers.filter(name => !fixedDrivers.includes(name));

    // Fisher-Yates Shuffle (최종 결과를 미리 정해둠)
    for (let i = passengers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passengers[i], passengers[j]] = [passengers[j], passengers[i]];
    }

    const seats = document.querySelectorAll('.seat.passenger');
    const cars = document.querySelectorAll('.car-box');

    // 1. Reset
    seats.forEach(seat => {
        seat.textContent = '';
        seat.classList.remove('filled', 'shuffling');
        seat.style.backgroundColor = '';
    });

    // 2. Start Shifting Effect (차량 떨림)
    cars.forEach(car => car.classList.add('shaking'));

    const intervalIds = [];
    const pool = [...passengers]; // 룰렛용 이름 풀

    // 각 좌석마다 룰렛 효과 시작
    seats.forEach((seat, index) => {
        seat.classList.add('shuffling');

        // Rapidly change names
        const intervalId = setInterval(() => {
            const randomName = pool[Math.floor(Math.random() * pool.length)];
            seat.textContent = randomName;
        }, 50 + Math.random() * 50); // 속도 약간씩 다르게

        intervalIds.push(intervalId);
    });

    // 3. 순차적으로 멈추기
    seats.forEach((seat, index) => {
        // 딜레이: 시작 1.5초 후부터 0.4초 간격으로 하나씩 확정
        const delay = 1500 + index * 400;

        setTimeout(() => {
            clearInterval(intervalIds[index]); // 룰렛 중지
            seat.classList.remove('shuffling');
            seat.textContent = passengers[index]; // 최종 이름 할당
            seat.classList.add('filled');
        }, delay);
    });

    // 4. 모든 애니메이션 종료 후 떨림 멈춤
    const totalDuration = 1500 + seats.length * 400 + 500;
    setTimeout(() => {
        cars.forEach(car => car.classList.remove('shaking'));
    }, totalDuration);
}
