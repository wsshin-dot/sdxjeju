// ========================================
// 🗺️ 지도 초기화 및 편집 (Naver Maps API)
// ========================================

// 전역 변수 초기화 (script.js에서 이미 선언되었을 수 있으므로 덮어쓰기)
var LOCATIONS = LOCATIONS || {};
Object.assign(LOCATIONS, {
    airport: [33.5104, 126.4913],
    shinwooseong: [33.2492, 126.4109],
    lucete: [33.3190, 126.3853],
    stay: [33.248, 126.418],
    market: [33.2486, 126.5643],
    park981: [33.3667, 126.3562],
    letsrun: [33.41, 126.4],
    center: [33.35, 126.5]
});

var ROUTES = ROUTES || {};
Object.assign(ROUTES, {
    day1: ['airport', 'shinwooseong', 'stay', 'market'],
    day2: ['stay', 'lucete', 'park981', 'letsrun', 'market', 'stay'],
    day3: ['stay', 'airport']
});

var isEditingMap = isEditingMap || { day1: false, day2: false, day3: false };

function initMaps() {
    if (!window.mapInstances) window.mapInstances = [];

    const createOrUpdateMap = (dayKey) => {
        const elementId = `map-${dayKey}`;
        const container = document.getElementById(elementId);
        if (!container) return;

        // 1. 맵 인스턴스 찾기 또는 생성
        let mapInstance = window.mapInstances.find(m => m.id === dayKey);
        let map;
        let isNewMap = false;

        // 기존 마커/선 제거 (재렌더링)
        if (mapInstance) {
            map = mapInstance.map;
            if (mapInstance.markers) {
                mapInstance.markers.forEach(m => m.setMap(null));
            }
            if (mapInstance.polyline) {
                mapInstance.polyline.setMap(null);
            }
            mapInstance.markers = [];
            mapInstance.polyline = null;
        } else {
            isNewMap = true;
            // 네이버 지도 생성
            map = new naver.maps.Map(elementId, {
                center: new naver.maps.LatLng(LOCATIONS.center[0], LOCATIONS.center[1]),
                zoom: 10,
                zoomControl: true,
                zoomControlOptions: {
                    position: naver.maps.Position.TOP_RIGHT
                },
                scaleControl: false,
                logoControl: false,
                mapDataControl: false
            });

            // 클릭 이벤트 (핀 추가)
            naver.maps.Event.addListener(map, 'click', (e) => {
                if (isEditingMap[dayKey]) {
                    addPin(dayKey, { lat: e.coord.lat(), lng: e.coord.lng() });
                }
            });

            window.mapInstances.push({
                id: dayKey,
                map: map,
                markers: [],
                polyline: null,
                bounds: null
            });
            mapInstance = window.mapInstances.find(m => m.id === dayKey);
        }

        // 2. 경로 데이터 준비
        const routeKeys = ROUTES[dayKey] || [];
        const coords = routeKeys.map(key => {
            const loc = LOCATIONS[key] || LOCATIONS.center;
            return new naver.maps.LatLng(loc[0], loc[1]);
        });

        // 3. 경로 그리기 (Polyline)
        if (coords.length > 0) {
            const polyline = new naver.maps.Polyline({
                map: map,
                path: coords,
                strokeColor: '#FF6B00',
                strokeWeight: 4,
                strokeOpacity: 0.8,
                strokeStyle: 'shortdash'
            });
            mapInstance.polyline = polyline;
        }

        // 4. 마커 찍기
        routeKeys.forEach((key, index) => {
            const loc = LOCATIONS[key];
            if (!loc) return;

            const position = new naver.maps.LatLng(loc[0], loc[1]);
            const number = index + 1;

            // 커스텀 마커 아이콘 (번호 표시)
            const markerOptions = {
                map: map,
                position: position,
                icon: {
                    content: `<div style="
                        background-color: #FF6B00;
                        color: white;
                        border-radius: 50%;
                        width: 28px;
                        height: 28px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 14px;
                        border: 2px solid white;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                        cursor: ${isEditingMap[dayKey] ? 'move' : 'pointer'};
                    ">${number}</div>`,
                    anchor: new naver.maps.Point(14, 14)
                },
                draggable: isEditingMap[dayKey]
            };

            const marker = new naver.maps.Marker(markerOptions);
            mapInstance.markers.push(marker);

            // 마커 클릭 이벤트 (삭제)
            naver.maps.Event.addListener(marker, 'click', () => {
                if (isEditingMap[dayKey]) {
                    removePin(dayKey, index);
                }
            });

            // 드래그 종료 이벤트 (위치 업데이트)
            if (isEditingMap[dayKey]) {
                naver.maps.Event.addListener(marker, 'dragend', (e) => {
                    const newPos = marker.getPosition();
                    LOCATIONS[key] = [newPos.lat(), newPos.lng()];
                    // 폴리라인 업데이트
                    setTimeout(() => initMaps(), 0);
                });
            }
        });

        // 5. 줌 설정 (처음 생성 시에만)
        if (coords.length > 0) {
            const bounds = new naver.maps.LatLngBounds();
            coords.forEach(c => bounds.extend(c));
            mapInstance.bounds = bounds;

            if (isNewMap) {
                map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
            }
        }
    };

    createOrUpdateMap('day1');
    createOrUpdateMap('day2');
    createOrUpdateMap('day3');
}

function refreshMaps() {
    if (window.mapInstances) {
        window.mapInstances.forEach(item => {
            // 네이버 지도는 resize 이벤트로 갱신
            naver.maps.Event.trigger(item.map, 'resize');
            if (item.bounds) {
                setTimeout(() => {
                    item.map.fitBounds(item.bounds, { top: 50, right: 50, bottom: 50, left: 50 });
                }, 200);
            }
        });
    }
}

// 📌 핀 편집 기능
function toggleMapEdit(dayKey, btn) {
    if (!isEditingMap[dayKey]) {
        const password = prompt('지도 편집하려면 비밀번호를 입력하세요:');
        if (password !== '901210') {
            alert('비밀번호가 틀렸습니다.');
            return;
        }
    }

    const isEditing = !isEditingMap[dayKey];
    isEditingMap[dayKey] = isEditing;

    const mapContainer = document.getElementById(`map-${dayKey}`);

    if (isEditing) {
        btn.textContent = '✅ 완료';
        btn.classList.add('editing');
        mapContainer.classList.add('map-editing-border');
        alert('지도 편집 모드 시작!\n\n🖱️ 핀 드래그: 위치 이동\n🖱️ 지도 클릭: 핀 추가\n🗑️ 핀 클릭: 핀 삭제');
    } else {
        btn.textContent = '✏️ 핀 편집';
        btn.classList.remove('editing');
        mapContainer.classList.remove('map-editing-border');
        updateMapDataInConfig(); // 설정 객체 업데이트
        saveBudgetToDB(); // DB 저장
    }

    // 편집 모드 변경 반영 (드래그 활성화 등)
    initMaps();
}

function addPin(dayKey, latlng) {
    const name = prompt('장소 이름을 입력하세요 (예: 맛집, 관광지)');
    if (!name) return;

    const id = 'custom_' + Date.now();
    LOCATIONS[id] = [latlng.lat, latlng.lng];
    ROUTES[dayKey].push(id);

    // 재렌더링
    initMaps();
}

function removePin(dayKey, index) {
    if (confirm('이 핀을 경로에서 삭제하시겠습니까?')) {
        const route = ROUTES[dayKey];
        route.splice(index, 1);
        initMaps();
    }
}

// DB 데이터 연동
function updateMapDataInConfig() {
    if (!BUDGET_CONFIG.costs.mapData) BUDGET_CONFIG.costs.mapData = {};
    BUDGET_CONFIG.costs.mapData = {
        locations: LOCATIONS,
        routes: ROUTES
    };
}
