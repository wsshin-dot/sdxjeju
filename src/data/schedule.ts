export interface ScheduleItem {
    time: string;
    title: string;
    desc?: string[];
    badges?: { text: string; color: 'blue' | 'red' | 'orange' }[];
    highlight?: boolean;
    costTag?: { id: string; label: string }; // id maps to budget config key
    mapLink?: { name: string; url: string };
    subItems?: { title: string; desc: string }[];
    options?: {
        tag: string;
        tagName: string;
        isRec?: boolean;
        price?: string;
        desc: string;
        mapUrl?: string;
        onClick?: () => void;
    }[];
}

export const SCHEDULE_DAY1: ScheduleItem[] = [
    {
        time: "17:40",
        title: "공항 출발",
        highlight: true,
        desc: [
            "✈️ 2026-02-05 (목) 17:40 → 18:55",
            "비행시간 약 75분",
            "⚠️ 위탁수하물 마감: 17:10 (출발 30분전)"
        ],
        costTag: { id: 'flight', label: 'flight' }
    },
    {
        time: "19:30",
        title: "렌터카 수령 & 이동",
        highlight: true,
        desc: [
            "📍 집합: 공항 1층 5번 게이트 (실내)",
            "🚌 셔틀: 렌터카하우스 1구역 2승차장",
            "셔틀 탑승 → 차량 인수 (싼타페)",
            "🚙 이동: 약 50분 (공항→숙소)"
        ],
        mapLink: { name: "숙소(씨사이드아덴) 지도보기", url: "https://map.naver.com/p/search/씨사이드아덴" }
    },
    // ... more items
    {
        time: "21:00",
        title: "저녁식사: 신우성 흑돼지",
        highlight: true,
        costTag: { id: 'day1Dinner', label: 'day1-dinner' },
        desc: ["🐷 중문 흑돼지 맛집에서 저녁"],
        options: [
            { tag: "확정", tagName: "신우성 흑돼지", isRec: true, desc: "중문 흑돼지 맛집 🔥", mapUrl: "https://map.naver.com/p/search/신우성흑돼지%20중문" }
        ]
    },
    {
        time: "23:00",
        title: "보드게임 (숙소)",
        highlight: true,
        costTag: { id: 'whiskey', label: 'whiskey' },
        desc: ["🎲 숙소에서 보드게임 진행", "예산에서 1인당 2만원 차감"],
        subItems: [
            { title: "📺 MT st 게임 (앉아서)", desc: "1. 병뚜껑 멀리 보내기\n2. 노래 맞추기\n3. 마피아" },
            { title: "🥃 위스키 블라인드 테스트", desc: "조니워커 4종 (레드/블랙/그린/블루)" }
        ]
    }
];

export const SCHEDULE_DAY2: ScheduleItem[] = [
    // Simplified for brevity in this step, can expand later
    {
        time: "08:00",
        title: "자유 시간 & 아침 식사",
        highlight: true,
        desc: ["중문 관광 및 아침식사 or 휴식"],
        options: [
            { tag: "추천", tagName: "수두리보말칼국수", isRec: true, price: "~1.3만원", desc: "웨이팅 필수 맛집 🍜", mapUrl: "https://map.naver.com/p/search/수두리보말칼국수" }
        ]
    },
    {
        time: "13:00",
        title: "9.81파크 방문",
        highlight: true,
        badges: [{ text: "확정", color: "red" }],
        costTag: { id: 'park981', label: '981' },
        desc: ["🏎️ 레이싱 2회 + 서바이벌 1회", "☕ 카페 9.81파크 내 Space Zero 이용"],
        mapLink: { name: "지도보기", url: "https://map.naver.com/p/search/9.81파크" }
    }
];


export const SCHEDULE_DAY3: ScheduleItem[] = [
    {
        time: "10:00",
        title: "숙소 체크아웃",
        highlight: true,
        desc: ["🏠 짐 정리 및 숙소 퇴실"]
    },
    {
        time: "13:00",
        title: "점심: 탐나게",
        badges: [{ text: "개별결제", color: "blue" }],
        desc: ["🥄 제주시 애월읍 맛집 '탐나게'", "참게장 맛집"]
    }
];
