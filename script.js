
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
    // 항공권(10만원)은 선결제/고정비용으로 간주하여 잔액 계산에서 제외
    const remaining = BUDGET_CONFIG.totalBudgetPerPerson - (total - c.flight);

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
        day1Info.innerHTML = `💡 총 예산 ${totalMan} 만원(1인 ${perPersonMan}만원) | 항공 + 렌트 / 기름 포함 < br >🏠 숙소비: 1인 2만원(별도, 예산 미포함) - 이재환 선임에게 2만원 입금 🙏`;
    }

    // Info Tab Per Person
    const infoPerPerson = document.getElementById('info-per-person-budget');
    if (infoPerPerson) infoPerPerson.textContent = BUDGET_CONFIG.totalBudgetPerPerson.toLocaleString() + '원';

    // Info Tab Footer
    const footerInfo = document.getElementById('info-footer-box');
    if (footerInfo) {
        footerInfo.textContent = `숙소: 1인 2만원(이재환 선임에게 2만원 입금) | 총 예산: ${totalMan} 만원(${count}명)`;
    }

    // 예산 기준 텍스트
    const calcCriteria = document.getElementById('calc-criteria');
    if (calcCriteria) calcCriteria.textContent = perPersonMan + '만원';


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
const SUPABASE_KEY = 'sb_publishable_n8CptUQG5FADwx5uHMDIdw_C9G6yUA-';

// Supabase REST API 호출 헬퍼
async function supabaseRequest(table, method = 'GET', body = null, select = '*') {
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY} `,
        'Content-Type': 'application/json',
        'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
    };

    let url = `${SUPABASE_URL} /rest/v1 / ${table} `;
    if (method === 'GET') {
        url += `? select = ${select}& order=created_at.desc & limit=1`;
    }
    if (method === 'PATCH') {
        url += '?id=eq.1'; // 항상 id=1 레코드 업데이트
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Supabase error: ${response.status} `);
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
                    // totalBudget과 personCount는 기본값으로 유지하거나, totalBudgetPerPerson * personCount로 추정
                    // 여기서는 기존 totalBudgetPerPerson만 복원하고, totalBudget/personCount는 기본값 유지
                    // 또는, totalBudgetPerPerson을 기반으로 totalBudget을 역산 (기존 personCount 사용)
                    BUDGET_CONFIG.totalBudget = BUDGET_CONFIG.totalBudgetPerPerson * BUDGET_CONFIG.personCount;
                }

                // 비용 데이터 복사
                Object.assign(BUDGET_CONFIG.costs, budgetData.costs);
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
        statusEl.innerHTML = `< span class="db-status error" >❌ ${error.message}</span > `;
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
    updateAllBudgetDisplays();
});

function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    engine.world.gravity.y = 0.2; // 중력 낮춤 (느리게)

    // 2. 렌더러
    const width = container.offsetWidth;
    const height = container.offsetHeight;

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

    // 3. 맵 구성 (3단 코스)
    const wallOpts = { isStatic: true, render: { fillStyle: '#444' } };
    const pegOpts = { isStatic: true, render: { fillStyle: '#888' }, restitution: 0.5 };
    const bounceOpts = { isStatic: true, render: { fillStyle: '#666' }, restitution: 1.0 }; // 잘 튀는 벽

    Composite.add(engine.world, [
        Bodies.rectangle(0, height / 2, 20, height, wallOpts), // 좌벽
        Bodies.rectangle(width, height / 2, 20, height, wallOpts), // 우벽
    ]);

    // [1구간] 상단 Plinko (핀)
    const startY = 100;
    for (let row = 0; row < 5; row++) {
        const cols = row % 2 === 0 ? 6 : 5;
        const spacingX = width / (cols + 1);
        for (let col = 1; col <= cols; col++) {
            Composite.add(engine.world, Bodies.circle(col * spacingX, startY + row * 50, 5, pegOpts));
        }
    }

    // [2구간] 중단 Spinners (회전 풍차)
    const spinnerY = 400;
    const createSpinner = (x, y) => {
        const spinner = Bodies.rectangle(x, y, 120, 10, {
            label: 'spinner',
            render: { fillStyle: '#E91E63' }
        });
        const constraint = Constraint.create({
            pointA: { x: x, y: y },
            bodyB: spinner,
            stiffness: 1,
            length: 0
        });
        return [spinner, constraint];
    };

    Composite.add(engine.world, createSpinner(width * 0.3, spinnerY));
    Composite.add(engine.world, createSpinner(width * 0.7, spinnerY));

    // [3구간] 하단 Funnel (깔때기)
    const slopeOpts = { isStatic: true, render: { fillStyle: '#555' }, angle: Math.PI * 0.15 };
    const slopeY = 600;

    Composite.add(engine.world, [
        // 왼쪽 경사
        Bodies.rectangle(width * 0.2, slopeY, width * 0.6, 20, {
            isStatic: true, angle: 0.5, render: { fillStyle: '#555' }, label: 'slope'
        }),
        // 오른쪽 경사
        Bodies.rectangle(width * 0.8, slopeY, width * 0.6, 20, {
            isStatic: true, angle: -0.5, render: { fillStyle: '#555' }, label: 'slope'
        }),
        // 최종 깔때기 입구 (중앙) - 벽 크기 축소
        Bodies.rectangle(width * 0.25, height - 100, width * 0.25, 15, { isStatic: true, angle: 0.6, render: { fillStyle: '#333' } }),
        Bodies.rectangle(width * 0.75, height - 100, width * 0.25, 15, { isStatic: true, angle: -0.6, render: { fillStyle: '#333' } })
    ]);

    // 4. 구슬 생성
    const marbleRadius = 8;
    names.forEach((name, i) => {
        const x = width / 2 + (Math.random() - 0.5) * 50;
        const y = -100 - (i * 60); // 간격 넓힘

        const marble = Bodies.circle(x, y, marbleRadius, {
            restitution: 0.7,
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

    item.innerHTML = `< span > ${medal}</span > <span>${name}</span>`;
    list.appendChild(item);
    board.scrollTop = board.scrollHeight;
}



// 예산 잠금해제 함수
let budgetUnlocked = false;
const BUDGET_PASSWORD = '901210';
let customItemCount = 0;

function unlockBudget() {
    const inputs = document.querySelectorAll('.budget-input');
    const configInputs = document.querySelectorAll('.config-input'); // New: config inputs
    const btn = document.getElementById('unlock-btn');
    const status = document.getElementById('budget-status');
    const addBtn = document.getElementById('add-item-btn');

    if (!budgetUnlocked) {
        const password = prompt('비밀번호를 입력하세요:');
        if (password !== BUDGET_PASSWORD) {
            alert('비밀번호가 틀렸습니다!');
            return;
        }
        inputs.forEach(input => input.disabled = false);
        configInputs.forEach(input => input.disabled = false); // New: enable config inputs
        btn.innerHTML = '🔓 잠금';
        status.textContent = '✏️ 수정 가능! 값을 변경하면 자동 계산됩니다';
        addBtn.style.display = 'block';
        budgetUnlocked = true;
    } else {
        inputs.forEach(input => input.disabled = true);
        configInputs.forEach(input => input.disabled = true); // New: disable config inputs
        btn.innerHTML = '🔒 잠금해제';
        status.textContent = '🔒 수정하려면 잠금해제를 눌러주세요';
        addBtn.style.display = 'none';
        budgetUnlocked = false;
    }
}

function addBudgetItem() {
    addBudgetItemFromData('', 0, false);
}

function addBudgetItemFromData(label, value, confirmed) {
    customItemCount++;
    const container = document.getElementById('custom-budget-items');
    const itemId = `custom - item - ${customItemCount} `;

    const row = document.createElement('div');
    row.className = 'budget-input-row';
    row.id = itemId;
    row.innerHTML = `
    < input type = "checkbox" class="custom-confirmed" ${confirmed ? 'checked' : ''} onchange = "onBudgetChange()"
style = "width:20px; height:20px; margin-right:8px; accent-color:#4CAF50;" >
    <input type="text" class="budget-label-input" placeholder="항목명" value="${label}"
        style="flex:1; padding:8px; border:1px solid #ddd; border-radius:8px; font-size:0.9rem;" oninput="onBudgetChange()">
        <input type="number" class="budget-input custom-cost" value="${value}" oninput="onBudgetChange()">
            <span class="budget-unit">원</span>
            <button onclick="removeBudgetItem('${itemId}')"
                style="margin-left:8px; padding:6px 10px; background:#ff5252; color:white; border:none; border-radius:6px; cursor:pointer;">✕</button>
            `;

    container.appendChild(row);
    onBudgetChange();
}

function removeBudgetItem(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
        onBudgetChange();
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
    // BUDGET_CONFIG 업데이트
    BUDGET_CONFIG.costs.flight = parseInt(document.getElementById('cost-flight').value) || 0;
    BUDGET_CONFIG.costs.rent = parseInt(document.getElementById('cost-rent').value) || 0;
    BUDGET_CONFIG.costs.day1Dinner = parseInt(document.getElementById('cost-day1-dinner').value) || 0;
    BUDGET_CONFIG.costs.park981 = parseInt(document.getElementById('cost-981').value) || 0;
    BUDGET_CONFIG.costs.day2Lunch = parseInt(document.getElementById('cost-day2-lunch').value) || 0;
    BUDGET_CONFIG.costs.day2Cafe = parseInt(document.getElementById('cost-day2-tour').value) || 0;
    BUDGET_CONFIG.costs.day2Dinner = parseInt(document.getElementById('cost-day2-dinner').value) || 0;

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

        // 확정된 항목 UI 업데이트 (회색처리, 비활성화, 삭제버튼 숨김)
        const deleteBtn = row.querySelector('button');
        if (confirmed) {
            if (labelInput) labelInput.disabled = true;
            if (costInput) costInput.disabled = true;
            if (deleteBtn) deleteBtn.style.display = 'none';
        } else {
            if (labelInput) labelInput.disabled = false;
            if (costInput) costInput.disabled = false;
            if (deleteBtn) deleteBtn.style.display = '';
        }

        // 스타일은 CSS 기본값(회색) 사용
        row.style.border = '';
        row.style.background = '';
    });
    BUDGET_CONFIG.costs.customItems = customItems;
    BUDGET_CONFIG.costs.customTotal = customTotal;

    // 모든 표시 업데이트
    updateAllBudgetDisplays();
}

// 페이지 로드시 예산 업데이트
document.addEventListener('DOMContentLoaded', async function () {
    // 먼저 DB에서 예산 데이터 로드 시도
    await loadBudgetFromDB();
    // 그 후 모든 표시 업데이트
    updateAllBudgetDisplays();
});
