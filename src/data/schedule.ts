
export interface ScheduleItem {
    time: string;
    title: string;
    desc?: string[];
    // Rain Mode Overrides
    rainyTitle?: string;
    rainyDesc?: string[];

    condition?: 'sunny' | 'rainy'; // If set, only shows in that mode

    badges?: { text: string; color: 'blue' | 'red' | 'orange' }[];
    highlight?: boolean;
    costTag?: { id: string; label: string };
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
        condition?: 'sunny' | 'rainy'; // Option-level condition
    }[];
}

export const SCHEDULE_DAY1: ScheduleItem[] = [
    {
        time: "17:40",
        title: "공항 출발",
        highlight: true,
        desc: [
            "✈️ 2026-02-05 (목) 17:40 → 18:55",
            "비행시간 약 75분"
        ],
        subItems: [
            { title: "위탁수하물 마감", desc: "17:10 (출발 30분전) ⚠️" }
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
    {
        time: "20:20",
        title: "장보기 (선택)",
        badges: [{ text: "시간되면", color: "blue" }],
        desc: [
            "🛒 숙소에서 먹을 음료, 안주 등 장보기 (선택사항)",
            "⚠️ 저녁식사(21:00) 늦지 않게 주의!"
        ],
        options: [
            { tag: "옵션1", tagName: "이마트/롯데마트", desc: "공항 근처 (신제주) / 23시 마감", mapUrl: "https://map.naver.com/p/search/이마트신제주점" },
            { tag: "옵션2", tagName: "중문농협 하나로마트", isRec: true, desc: "숙소 근처 (중문) / 22시 마감", mapUrl: "https://map.naver.com/p/search/중문농협하나로마트본점" }
        ]
    },
    {
        time: "21:00",
        title: "저녁식사: 신우성 흑돼지",
        highlight: true,
        costTag: { id: 'day1Dinner', label: 'day1-dinner' },
        desc: ["🐷 중문 흑돼지 맛집에서 저녁", "🚙 이동: 약 3분 / 🚶 도보: 약 15분 (숙소→식당)"],
        options: [
            { tag: "확정", tagName: "신우성 흑돼지", isRec: true, desc: "중문 흑돼지 맛집 🔥", mapUrl: "https://map.naver.com/p/search/신우성흑돼지%20중문" }
        ]
    },
    {
        time: "22:50",
        title: "숙소 복귀 (도보)",
        rainyTitle: "숙소 복귀 (택시)",
        highlight: true,
        desc: [
            "🚶 도보: 약 15분 (식당→숙소)",
            "소화시킬 겸 산책 🌙"
        ],
        rainyDesc: [
            "🚕 우천 시: 셔틀 이용",
            "이동: 약 3분 / 기본요금 예상"
        ]
    },
    {
        time: "23:00",
        title: "보드게임 (숙소)",
        highlight: true,
        costTag: { id: 'whiskey', label: 'whiskey' },
        desc: [
            "🎲 숙소에서 보드게임 진행",
            "추천 게임: 달무티, 코드네임, 마피아 등",
            "예산에서 1인당 2만원 차감",
            "👕 벌칙: 테무옷 입기, 입수, 2일차 카페 내기"
        ],
        subItems: [
            { title: "📺 MT st 게임 (앉아서)", desc: "1. 병뚜껑 멀리 보내기\n2. 노래 맞추기\n3. 마피아" },
            { title: "🥃 위스키 블라인드 테스트", desc: "조니워커 4종 (레드/블랙/그린/블루)" }
        ]
    }
];

export const SCHEDULE_DAY2: ScheduleItem[] = [
    {
        time: "08:00",
        title: "자유 시간 & 아침 식사",
        highlight: true,
        desc: [
            "중문 관광 및 아침식사 or 휴식",
            "🚙 이동: 약 5분 / 🚶 도보: 약 20분 (중문 시내)"
        ],
        rainyDesc: [
            "☔ 우천 시: 실내 위주 중문 자유 일정",
            "🚙 이동: 약 5분 (중문 시내)"
        ],
        subItems: [
            { title: "새벽 낚시 (선택)", desc: "개인 2~5만원 / 서귀포 선상 체험 🎣" }
        ],
        options: [
            { tag: "추천", tagName: "수두리보말칼국수", isRec: true, price: "~1.3만원", desc: "웨이팅 필수 맛집 🍜 / 테이블링 필수", mapUrl: "https://map.naver.com/p/search/수두리보말칼국수" }
        ]
    },
    {
        time: "11:30",
        title: "점심 식당 도착",
        highlight: true,
        costTag: { id: 'day2Lunch', label: 'day2-lunch' },
        desc: ["📍 중문관광단지 맛집 후보군 (택1)", "🚙 이동: 5분 / 🚶 도보: 약 15~20분"],
        options: [
            { tag: "추천", tagName: "고집돌우럭", isRec: true, price: "~2.4만원", desc: "우럭조림 런치세트 🐟 / 네이버예약 권장", mapUrl: "https://map.naver.com/p/search/고집돌우럭중문점" },
            { tag: "후보2", tagName: "제주오성", price: "~2.5만원", desc: "통갈치조림/구이 정식", mapUrl: "https://map.naver.com/p/search/제주오성" },
            { tag: "후보3", tagName: "예지원", price: "~2.0만원", desc: "전복뚝배기/성게미역국", mapUrl: "https://map.naver.com/p/search/예지원%20중문" }
        ]
    },
    {
        time: "13:00",
        title: "9.81파크 방문",
        highlight: true,
        badges: [{ text: "확정", color: "red" }],
        costTag: { id: 'park981', label: '981' },
        desc: [
            "🏎️ 레이싱 2회 + 서바이벌 1회",
            "☕ 카페 9.81파크 내 Space Zero 이용",
            "🤡 꼴찌 벌칙: 이후 일정 테무 장신구 착용",
            "🚙 이동: 약 30분 (중문→애월)"
        ],
        rainyTitle: "실내 액티비티 및 관광 진행 (우천)",
        rainyDesc: [
            "☔ 우천 시 대체 액티비티 진행",
            "실내 게임 / 대유랜드 사격 / 항공우주박물관",
            "숙소 이동 없음 (애월/중문 근처)"
        ],
        subItems: [
            { title: "주의사항", desc: "⚠️ 샌들/슬리퍼 탑승 금지 (뒤 막힌 신발)\nAPP 미리 설치 필수" }
        ],
        mapLink: { name: "지도보기", url: "https://map.naver.com/p/search/9.81파크" },
        options: [  // Add rainy options explicitly checkable
            { tag: "우천1", tagName: "대유랜드", desc: "반실내 클레이 사격", price: "~4.5만원", mapUrl: "https://map.naver.com/p/search/대유랜드", condition: "rainy" },
            { tag: "우천2", tagName: "9.81 실내게임", desc: "서바이벌/스포츠랩", price: "~3.0만원", condition: "rainy" },
            { tag: "우천3", tagName: "항공우주박물관", desc: "실내 전시/4D", price: "~1.0만원", mapUrl: "https://map.naver.com/p/search/제주항공우주박물관", condition: "rainy" }
        ]
    },
    {
        time: "15:30",
        title: "렛츠런 파크 (선택)",
        badges: [{ text: "시간되면", color: "blue" }],
        desc: [
            "🐎 경마 체험 (시간 여유 시 방문)",
            "🚙 이동: 약 15분 (9.81→렛츠런)"
        ],
        rainyTitle: "오설록 티 뮤지엄 (우천)",
        rainyDesc: [
            "☔ 우천 시: 오설록 티 뮤지엄",
            "녹차 아이스크림 & 티 타임 🍵",
            "🚙 이동: 9.81파크에서 20분"
        ]
    },
    {
        time: "17:30",
        title: "서귀포 올레시장 이동",
        highlight: true,
        desc: [
            "렛츠런파크 → 서귀포",
            "🚙 이동: 약 50분 (애월→서귀포)"
        ]
    },
    {
        time: "18:30",
        title: "올레시장 장보기 → 숙소 리턴",
        highlight: true,
        costTag: { id: 'day2Dinner', label: 'day2-dinner' },
        desc: [
            "🛒 올레시장에서 장보기 후 숙소 저녁식사",
            "말육회, 방어회, 흑돼지 등 먹거리 포장",
            "🚙 복귀: 약 30분 (시장→숙소)"
        ],
        subItems: [
            { title: "주차", desc: "공영주차장(30분무료) or 삼진탕 옆 무료주차장" }
        ],
        options: [
            { tag: "확정", tagName: "매일올레시장", isRec: true, desc: "다양한 먹거리 포장 🍢", mapUrl: "https://map.naver.com/p/search/서귀포매일올레시장" }
        ]
    }
];

export const SCHEDULE_DAY3: ScheduleItem[] = [
    {
        time: "07:30",
        title: "조기 복귀팀 반납",
        badges: [{ text: "선택", color: "blue" }],
        desc: [
            "🚗 빌리카 반납 (오전 비행기 인원)",
            "셔틀 탑승 → 공항 이동",
            "🚙 이동: 약 50분 (숙소→공항)"
        ]
    },
    {
        time: "10:00",
        title: "숙소 체크아웃",
        highlight: true,
        desc: [
            "🏠 짐 정리 및 숙소 퇴실",
            "오후 비행기 인원 (~ 빌리카 반납)"
        ]
    },
    {
        time: "13:00",
        title: "점심: 탐나게",
        badges: [{ text: "개별결제", color: "blue" }],
        desc: ["🥄 제주시 애월읍 맛집 '탐나게'", "참게장 맛집"],
        mapLink: { name: "지도보기", url: "https://map.naver.com/p/search/탐나게" }
    },
    {
        time: "14:00",
        title: "카페 (자유 선택)",
        badges: [{ text: "개별결제", color: "blue" }],
        desc: ["☕ 공항 근처 or 애월 카페", "마지막 휴식 및 커피"]
    },
    {
        time: "15:15",
        title: "공항 도착 (샌딩)",
        desc: [
            "🚐 공항 도착 및 하차",
            "신우성 전임: 렌터카 반납",
            "⛽ 반납 전 주유 필수 (공항 5km 전 등유/경유 확인)"
        ]
    },
    {
        time: "16:15",
        title: "일정 종료",
        highlight: true,
        desc: ["✈️ 비행기 탑승", "수고하셨습니다! 👋"]
    }
];
