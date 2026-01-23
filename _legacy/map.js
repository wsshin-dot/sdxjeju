// ========================================
// 🗺️ 지도 초기화 (Naver Maps API)
// ========================================

// 전역 변수 초기화 (script.js에서 이미 선언되었을 수 있으므로 덮어쓰기)
var LOCATIONS = LOCATIONS || {};
Object.assign(LOCATIONS, {
    airport: [33.5104, 126.4913],
    shinwooseong: [33.2492, 126.4109],
    gojip: [33.2579, 126.4168],
    stay: [33.248, 126.418],
    market: [33.2486, 126.5643],
    park981: [33.3667, 126.3562],
    letsrun: [33.41, 126.4],
    center: [33.35, 126.5]
});

var ROUTES = ROUTES || {};
Object.assign(ROUTES, {
    day1: ['airport', 'stay', 'shinwooseong'],
    day2: ['stay', 'gojip', 'park981', 'letsrun', 'market', 'stay'],
    day3: ['stay', 'airport']
});

var LOCATION_INFO = {
    airport: { name: "✈️ 제주국제공항", desc: "공항항 공항항" },
    shinwooseong: { name: "🐷 신우성 흑돼지", desc: "Day 1 저녁: 흑돼지 맛집" },
    stay: { name: "🏠 씨사이드 아덴", desc: "숙소: 편안한 휴식" },
    market: { name: "🍊 매일올레시장", desc: "Day 2 저녁: 맛있는 먹거리 포장" },
    park981: { name: "🏎️ 9.81 파크", desc: "스피드 레이싱 & 서바이벌" },
    letsrun: { name: "🐎 렛츠런 파크", desc: "승부의 세계 (경마)" },
    gojip: { name: "🐟 고집돌우럭", desc: "Day 2 점심: 중문 맛집" },
    center: { name: "한라산", desc: "제주의 중심" }
};

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

        // 기존 마커/선/인포윈도우 제거 (재렌더링)
        if (mapInstance) {
            map = mapInstance.map;
            if (mapInstance.markers) {
                mapInstance.markers.forEach(m => m.setMap(null));
            }
            if (mapInstance.polyline) {
                mapInstance.polyline.setMap(null);
            }
            // 기존 인포윈도우 닫기
            if (mapInstance.infoWindows) {
                mapInstance.infoWindows.forEach(iw => iw.close());
            }

            mapInstance.markers = [];
            mapInstance.polyline = null;
            mapInstance.infoWindows = []; // 인포윈도우 배열 초기화
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

            window.mapInstances.push({
                id: dayKey,
                map: map,
                markers: [],
                polyline: null,
                bounds: null,
                infoWindows: []
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
            const info = LOCATION_INFO[key] || { name: "장소", desc: "" };

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
                        cursor: pointer;
                    ">${number}</div>`,
                    anchor: new naver.maps.Point(14, 14)
                }
            };

            const marker = new naver.maps.Marker(markerOptions);
            mapInstance.markers.push(marker);

            // 💬 인포윈도우 (정보창) 생성
            const contentString = `
                <div style="padding:10px; min-width:150px; text-align:center; background:white; border-radius:8px; border:1px solid #ddd;">
                    <h4 style="margin:0 0 5px; font-size:14px; color:#333;">${info.name}</h4>
                    <p style="margin:0; font-size:12px; color:#666;">${info.desc}</p>
                </div>
            `;

            const infoWindow = new naver.maps.InfoWindow({
                content: contentString,
                borderWidth: 0,
                backgroundColor: 'transparent',
                anchorSize: new naver.maps.Size(10, 10),
                anchorSkew: true,
                anchorColor: 'white',
                pixelOffset: new naver.maps.Point(0, -5)
            });

            mapInstance.infoWindows.push(infoWindow);

            // 클릭 이벤트: 정보창 열기/닫기
            naver.maps.Event.addListener(marker, 'click', function () {
                if (infoWindow.getMap()) {
                    infoWindow.close();
                } else {
                    // 다른 열린 창 닫기 (선택 사항)
                    mapInstance.infoWindows.forEach(iw => iw.close());
                    infoWindow.open(map, marker);
                }
            });
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

// 지도 초기화 실행 로직 제거 (script.js에서 제어)
