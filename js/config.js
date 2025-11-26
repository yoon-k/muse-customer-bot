/**
 * MUSE Customer Bot - Configuration
 * 이 파일을 수정하여 상품, 가격, 설정을 변경하세요
 */

const CONFIG = {
    // 기본 설정
    botName: 'MUSE 상담봇',
    companyName: 'MUSE Studio',
    welcomeMessage: '안녕하세요! MUSE Studio입니다. 😊\n무엇을 도와드릴까요?',

    // 상담 가능 시간 (표시용)
    businessHours: '평일 09:00 - 18:00',

    // 연락처
    contact: {
        email: 'contact@muse.studio',
        phone: '02-1234-5678',
        kakao: 'muse_studio'
    },

    // 타이핑 효과 딜레이 (ms)
    typingDelay: 800,

    // 메시지 딜레이 (ms)
    messageDelay: 500
};

// 상품/서비스 정의
const PRODUCTS = {
    // 웹사이트 제작
    'web-basic': {
        id: 'web-basic',
        name: '웹사이트 기본형',
        category: 'website',
        basePrice: 500000,
        description: '5페이지 이내 반응형 웹사이트',
        features: ['반응형 디자인', '기본 SEO', '문의 폼', '1개월 무료 유지보수'],
        deliveryDays: 14
    },
    'web-professional': {
        id: 'web-professional',
        name: '웹사이트 프로페셔널',
        category: 'website',
        basePrice: 1500000,
        description: '10페이지 이내 고급 웹사이트',
        features: ['프리미엄 디자인', '고급 SEO', '관리자 페이지', 'SNS 연동', '3개월 무료 유지보수'],
        deliveryDays: 21
    },
    'web-shopping': {
        id: 'web-shopping',
        name: '쇼핑몰',
        category: 'website',
        basePrice: 3000000,
        description: '결제 시스템 포함 쇼핑몰',
        features: ['상품 관리', 'PG 결제 연동', '주문 관리', '재고 관리', '6개월 무료 유지보수'],
        deliveryDays: 30
    },

    // 앱 개발
    'app-hybrid': {
        id: 'app-hybrid',
        name: '하이브리드 앱',
        category: 'app',
        basePrice: 3000000,
        description: 'iOS/Android 동시 지원 앱',
        features: ['크로스플랫폼', '푸시 알림', '기본 기능', '3개월 무료 유지보수'],
        deliveryDays: 45
    },
    'app-native': {
        id: 'app-native',
        name: '네이티브 앱',
        category: 'app',
        basePrice: 5000000,
        description: 'iOS 또는 Android 네이티브 앱',
        features: ['최적화 성능', '네이티브 UI', '고급 기능', '6개월 무료 유지보수'],
        deliveryDays: 60
    },

    // AI 솔루션
    'ai-chatbot': {
        id: 'ai-chatbot',
        name: 'AI 챗봇',
        category: 'ai',
        basePrice: 1000000,
        description: '고객응대 AI 챗봇',
        features: ['24/7 자동 응대', '학습 기능', '다국어 지원', '분석 대시보드'],
        deliveryDays: 14
    },
    'ai-automation': {
        id: 'ai-automation',
        name: '업무 자동화',
        category: 'ai',
        basePrice: 2000000,
        description: 'AI 기반 업무 자동화',
        features: ['프로세스 자동화', '데이터 처리', 'API 연동', '맞춤 개발'],
        deliveryDays: 30
    },

    // 디자인
    'design-ui': {
        id: 'design-ui',
        name: 'UI/UX 디자인',
        category: 'design',
        basePrice: 500000,
        description: '웹/앱 UI/UX 디자인',
        features: ['사용자 리서치', '와이어프레임', '프로토타입', '디자인 시스템'],
        deliveryDays: 14
    },
    'design-branding': {
        id: 'design-branding',
        name: '브랜딩',
        category: 'design',
        basePrice: 1000000,
        description: '로고 및 브랜드 아이덴티티',
        features: ['로고 디자인', '컬러 시스템', '타이포그래피', '브랜드 가이드'],
        deliveryDays: 21
    }
};

// 추가 옵션
const OPTIONS = {
    'extra-pages': {
        id: 'extra-pages',
        name: '추가 페이지 (5페이지)',
        price: 200000,
        applicable: ['web-basic', 'web-professional']
    },
    'multi-language': {
        id: 'multi-language',
        name: '다국어 지원',
        price: 300000,
        applicable: ['web-basic', 'web-professional', 'web-shopping']
    },
    'seo-premium': {
        id: 'seo-premium',
        name: '프리미엄 SEO',
        price: 500000,
        applicable: ['web-basic', 'web-professional']
    },
    'maintenance-extended': {
        id: 'maintenance-extended',
        name: '유지보수 연장 (6개월)',
        price: 600000,
        applicable: ['web-basic', 'web-professional', 'app-hybrid']
    },
    'rush-delivery': {
        id: 'rush-delivery',
        name: '빠른 납품 (50% 단축)',
        priceMultiplier: 0.3, // 30% 추가
        applicable: 'all'
    }
};

// 할인 정책
const DISCOUNTS = {
    'bundle': {
        name: '패키지 할인',
        description: '2개 이상 서비스 주문시',
        rate: 0.1 // 10% 할인
    },
    'first-order': {
        name: '첫 주문 할인',
        description: '첫 주문 고객',
        rate: 0.05 // 5% 할인
    },
    'referral': {
        name: '추천인 할인',
        description: '추천인 코드 입력시',
        rate: 0.05 // 5% 할인
    }
};

// 카테고리 정보
const CATEGORIES = {
    'website': { name: '웹사이트 제작', icon: '🌐' },
    'app': { name: '앱 개발', icon: '📱' },
    'ai': { name: 'AI 솔루션', icon: '🤖' },
    'design': { name: '디자인', icon: '🎨' }
};
