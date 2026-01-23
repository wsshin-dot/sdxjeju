import { useEffect, useRef } from 'react';

// Hardcoded locations from map.js
const LOCATIONS: Record<string, [number, number]> = {
    airport: [33.5104, 126.4913],
    shinwooseong: [33.2492, 126.4109],
    gojip: [33.2579, 126.4168],
    stay: [33.248, 126.418],
    market: [33.2486, 126.5643],
    park981: [33.3667, 126.3562],
    letsrun: [33.41, 126.4],
    center: [33.35, 126.5]
};

const ROUTES: Record<string, string[]> = {
    day1: ['airport', 'stay', 'shinwooseong'],
    day2: ['stay', 'gojip', 'park981', 'letsrun', 'market', 'stay'],
    day3: ['stay', 'airport']
};

const LOCATION_INFO: Record<string, { name: string, desc: string }> = {
    airport: { name: "✈️ 제주국제공항", desc: "도착/출발" },
    shinwooseong: { name: "🐷 신우성 흑돼지", desc: "Day 1 저녁: 흑돼지 맛집" },
    stay: { name: "🏠 씨사이드 아덴", desc: "숙소: 편안한 휴식" },
    market: { name: "🍊 매일올레시장", desc: "Day 2 저녁: 맛있는 먹거리 포장" },
    park981: { name: "🏎️ 9.81 파크", desc: "스피드 레이싱 & 서바이벌" },
    letsrun: { name: "🐎 렛츠런 파크", desc: "승부의 세계 (경마)" },
    gojip: { name: "🐟 고집돌우럭", desc: "Day 2 점심: 중문 맛집" },
    center: { name: "한라산", desc: "제주의 중심" }
};

interface MapViewerProps {
    dayKey: 'day1' | 'day2' | 'day3';
    active: boolean; // Tells if parent tab is active, to trigger resize
}

export function MapViewer({ dayKey, active }: MapViewerProps) {
    const mapElementId = `map-${dayKey}`;
    const mapRef = useRef<any>(null);

    useEffect(() => {
        // Retry initialization if naver object is not ready immediately
        const init = () => {
            if (!window.naver || !window.naver.maps) {
                setTimeout(init, 100);
                return;
            }

            const container = document.getElementById(mapElementId);
            if (!container) return;

            // Prevent double init
            if (mapRef.current) return;

            const mapOptions = {
                center: new window.naver.maps.LatLng(LOCATIONS.center[0], LOCATIONS.center[1]),
                zoom: 10,
                zoomControl: true,
                scaleControl: false,
                logoControl: false,
                mapDataControl: false
            };

            const map = new window.naver.maps.Map(mapElementId, mapOptions);
            mapRef.current = map;

            // Draw Route
            const routeKeys = ROUTES[dayKey] || [];
            const coords = routeKeys.map(key => {
                const loc = LOCATIONS[key] || LOCATIONS.center;
                return new window.naver.maps.LatLng(loc[0], loc[1]);
            });

            if (coords.length > 0) {
                new window.naver.maps.Polyline({
                    map: map,
                    path: coords,
                    strokeColor: '#FF6B00',
                    strokeWeight: 4,
                    strokeOpacity: 0.8,
                    strokeStyle: 'shortdash'
                });

                // Fit bounds
                const bounds = new window.naver.maps.LatLngBounds();
                coords.forEach((c: any) => bounds.extend(c));
                map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
            }

            // Draw Markers
            routeKeys.forEach((key, index) => {
                const loc = LOCATIONS[key];
                if (!loc) return;
                const position = new window.naver.maps.LatLng(loc[0], loc[1]);
                const number = index + 1;
                const info = LOCATION_INFO[key] || { name: "장소", desc: "" };

                const markerContent = `
            <div style="background-color:#FF6B00;color:white;border-radius:50%;width:28px;height:28px;
            display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;
            border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);cursor:pointer;">
              ${number}
            </div>`;

                const marker = new window.naver.maps.Marker({
                    map: map,
                    position: position,
                    icon: {
                        content: markerContent,
                        anchor: new window.naver.maps.Point(14, 14)
                    }
                });

                // Infowindow
                const infoContent = `
            <div style="padding:10px;min-width:150px;text-align:center;background:white;border-radius:8px;border:1px solid #ddd;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
                <h4 style="margin:0 0 5px;font-size:14px;color:#333;font-weight:bold;">${info.name}</h4>
                <p style="margin:0;font-size:12px;color:#666;">${info.desc}</p>
            </div>
          `;

                const infoWindow = new window.naver.maps.InfoWindow({
                    content: infoContent,
                    borderWidth: 0,
                    backgroundColor: 'transparent',
                    anchorSize: new window.naver.maps.Size(10, 10),
                    pixelOffset: new window.naver.maps.Point(0, -5)
                });

                window.naver.maps.Event.addListener(marker, 'click', function () {
                    if (infoWindow.getMap()) {
                        infoWindow.close();
                    } else {
                        infoWindow.open(map, marker);
                    }
                });
            });
        };

        init();
    }, [dayKey]);

    // Handle Resize when tab becomes active
    useEffect(() => {
        if (active && mapRef.current && window.naver) {
            setTimeout(() => {
                window.naver.maps.Event.trigger(mapRef.current, 'resize');
                // Re-fit bounds if stored... skipped for brevity, but could store bounds in ref
            }, 100);
        }
    }, [active]);

    return <div id={mapElementId} className="w-full h-[300px] rounded-2xl overflow-hidden shadow-inner border border-gray-200 mt-5" />;
}
