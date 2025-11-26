/**
 * MUSE Customer Bot - AI 버전
 * OpenAI API 또는 무료 대안 사용
 *
 * 무료 옵션:
 * 1. Cloudflare Workers AI (무료 티어)
 * 2. Hugging Face Inference API (무료 티어)
 * 3. 사용자 OpenAI API 키 입력
 */

const MuseAIBot = {
    // 설정
    config: {
        // API 선택: 'openai' | 'cloudflare' | 'huggingface' | 'demo'
        provider: 'demo', // 기본은 데모 모드 (무료, AI 시뮬레이션)

        // OpenAI 설정 (사용자가 입력)
        openaiKey: null,
        openaiModel: 'gpt-3.5-turbo',

        // Cloudflare Workers AI (배포 시 설정)
        cfWorkerUrl: null,

        // Hugging Face (무료)
        hfApiUrl: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        hfToken: null, // 선택사항

        // 비즈니스 컨텍스트
        businessContext: `
당신은 MUSE Studio의 AI 고객상담 챗봇입니다.

[회사 정보]
- 회사명: MUSE Studio
- 서비스: 웹사이트 제작, 앱 개발, AI 솔루션, 디자인
- 연락처: contact@muse.studio / 02-1234-5678

[가격표]
- 웹사이트 Basic: 50만원~ (5페이지, 2주)
- 웹사이트 Professional: 150만원~ (10페이지, 3주)
- 쇼핑몰: 300만원~ (결제시스템 포함, 4주)
- 앱 개발 (하이브리드): 300만원~ (iOS/Android, 6주)
- 앱 개발 (네이티브): 500만원~ (8주)
- AI 챗봇: 100만원~ (2주)
- 업무 자동화: 200만원~ (4주)
- UI/UX 디자인: 50만원~ (2주)
- 브랜딩: 100만원~ (3주)

[역할]
1. 친절하고 전문적으로 고객 문의에 응답
2. 적절한 서비스를 추천
3. 견적을 안내하고 상담 예약 유도
4. 고객 정보(이름, 연락처) 수집하여 담당자 연결

[주의사항]
- 정해진 가격 이상을 임의로 할인하지 않음
- 기술적으로 불가능한 약속 금지
- 정확한 납기일은 상담 후 확정

항상 한국어로 답변하고, 이모지를 적절히 사용하세요.
`
    },

    // 상태
    isOpen: false,
    sessionId: null,
    conversationHistory: [],
    orderData: {},
    isProcessing: false,

    // 초기화
    init(userConfig = {}) {
        this.config = { ...this.config, ...userConfig };
        this.sessionId = 'sess_' + Date.now();
        this.loadHistory();

        // 설정 UI 표시 (API 키 입력)
        if (!this.config.openaiKey && this.config.provider === 'openai') {
            this.showApiKeyModal();
        }

        console.log('MUSE AI Bot initialized with provider:', this.config.provider);
    },

    // API 키 입력 모달
    showApiKeyModal() {
        const savedKey = localStorage.getItem('muse_openai_key');
        if (savedKey) {
            this.config.openaiKey = savedKey;
            this.config.provider = 'openai';
            return;
        }

        // 모달 표시 로직 (선택사항)
    },

    // 위젯 토글
    toggle() {
        this.isOpen ? this.close() : this.open();
    },

    open() {
        this.isOpen = true;
        document.getElementById('chatbot-widget').classList.add('open');

        if (!this.hasMessages()) {
            this.showWelcome();
        }
    },

    close() {
        this.isOpen = false;
        document.getElementById('chatbot-widget').classList.remove('open');
    },

    openWithMessage(message) {
        this.open();
        setTimeout(() => this.processMessage(message), 500);
    },

    // 환영 메시지
    showWelcome() {
        this.addBotMessage('안녕하세요! 😊 MUSE Studio입니다.\n\n웹사이트, 앱, AI 솔루션 관련 무엇이든 물어보세요!\n무료 견적 상담도 가능합니다.');
        this.showQuickReplies(['서비스 안내', '견적 문의', '포트폴리오 보기', '상담 예약']);
    },

    hasMessages() {
        return document.getElementById('chatbot-messages').children.length > 0;
    },

    // 메시지 전송
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message || this.isProcessing) return;

        input.value = '';
        this.addUserMessage(message);
        this.processMessage(message);
    },

    // AI로 메시지 처리
    async processMessage(userMessage) {
        this.isProcessing = true;
        this.showTyping();

        // 대화 히스토리에 추가
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        try {
            let response;

            switch (this.config.provider) {
                case 'openai':
                    response = await this.callOpenAI(userMessage);
                    break;
                case 'huggingface':
                    response = await this.callHuggingFace(userMessage);
                    break;
                case 'cloudflare':
                    response = await this.callCloudflare(userMessage);
                    break;
                default:
                    response = await this.callDemoAI(userMessage);
            }

            this.hideTyping();
            this.addBotMessage(response);

            // 히스토리에 추가
            this.conversationHistory.push({
                role: 'assistant',
                content: response
            });

            this.saveHistory();

            // 컨텍스트 기반 빠른 응답
            this.showContextualReplies(userMessage, response);

        } catch (error) {
            console.error('AI Error:', error);
            this.hideTyping();
            this.addBotMessage('죄송합니다, 일시적인 오류가 발생했습니다. 다시 시도해주세요.');
        }

        this.isProcessing = false;
    },

    // OpenAI API 호출
    async callOpenAI(userMessage) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.openaiKey}`
            },
            body: JSON.stringify({
                model: this.config.openaiModel,
                messages: [
                    { role: 'system', content: this.config.businessContext },
                    ...this.conversationHistory.slice(-10) // 최근 10개 대화만
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.choices[0].message.content;
    },

    // Hugging Face API 호출 (무료)
    async callHuggingFace(userMessage) {
        const prompt = this.buildHFPrompt(userMessage);

        const response = await fetch(this.config.hfApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.hfToken && { 'Authorization': `Bearer ${this.config.hfToken}` })
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 300,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return data[0].generated_text.trim();
    },

    buildHFPrompt(userMessage) {
        const recentHistory = this.conversationHistory.slice(-6)
            .map(m => `${m.role === 'user' ? '고객' : '상담원'}: ${m.content}`)
            .join('\n');

        return `[INST] ${this.config.businessContext}

이전 대화:
${recentHistory}

고객: ${userMessage}

상담원으로서 친절하게 답변하세요. [/INST]`;
    },

    // Cloudflare Workers AI 호출
    async callCloudflare(userMessage) {
        const response = await fetch(this.config.cfWorkerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: this.config.businessContext },
                    ...this.conversationHistory.slice(-10)
                ]
            })
        });

        const data = await response.json();
        return data.response;
    },

    // 데모 AI (무료, 간단한 규칙 기반 + 랜덤 응답)
    async callDemoAI(userMessage) {
        // 시뮬레이션 딜레이
        await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

        const lower = userMessage.toLowerCase();

        // 인사
        if (this.matchKeywords(lower, ['안녕', '하이', 'hello', '처음'])) {
            return this.randomResponse([
                '안녕하세요! 😊 MUSE Studio에 오신 걸 환영합니다.\n\n어떤 서비스가 필요하신가요? 웹사이트, 앱, AI 솔루션 등 다양한 서비스를 제공하고 있어요!',
                '반갑습니다! 👋 무엇을 도와드릴까요?\n\n궁금한 서비스가 있으시면 편하게 물어보세요!'
            ]);
        }

        // 서비스 문의
        if (this.matchKeywords(lower, ['서비스', '뭐해', '종류', '어떤것'])) {
            return `저희 MUSE Studio에서 제공하는 서비스입니다 🌟

🌐 **웹사이트 제작** (50만원~)
- 반응형, 쇼핑몰, 랜딩페이지

📱 **앱 개발** (300만원~)
- iOS/Android 하이브리드 & 네이티브

🤖 **AI 솔루션** (100만원~)
- 챗봇, 업무 자동화

🎨 **디자인** (30만원~)
- UI/UX, 브랜딩

어떤 서비스가 관심 있으신가요?`;
        }

        // 웹사이트
        if (this.matchKeywords(lower, ['웹', '홈페이지', '사이트'])) {
            return `웹사이트 제작에 관심 있으시군요! 👍

저희 패키지를 소개드릴게요:

📦 **Basic** (50만원~)
- 5페이지 이내
- 반응형 디자인
- 기본 SEO
- 제작 기간: 2주

📦 **Professional** (150만원~)
- 10페이지 이내
- 프리미엄 디자인
- 관리자 페이지 포함
- 제작 기간: 3주

📦 **쇼핑몰** (300만원~)
- 결제 시스템 연동
- 상품/주문 관리
- 제작 기간: 4주

원하시는 유형이나 예산을 말씀해주시면 맞춤 견적 드릴게요! 💰`;
        }

        // 앱
        if (this.matchKeywords(lower, ['앱', 'app', '모바일', '아이폰', '안드로이드'])) {
            return `앱 개발 문의 감사합니다! 📱

📦 **하이브리드 앱** (300만원~)
- iOS/Android 동시 개발
- React Native 또는 Flutter
- 비용 효율적
- 제작 기간: 6주

📦 **네이티브 앱** (500만원~)
- 최고 성능
- 플랫폼별 최적화
- 고급 기능 지원
- 제작 기간: 8주

어떤 종류의 앱을 생각하고 계신가요?
(예: 쇼핑몰 앱, 예약 앱, SNS 등)`;
        }

        // AI
        if (this.matchKeywords(lower, ['ai', '챗봇', '자동화', '인공지능'])) {
            return `AI 솔루션에 관심 있으시군요! 🤖

📦 **AI 챗봇** (100만원~)
- 24시간 고객 응대
- 학습 기능
- 다국어 지원

📦 **업무 자동화** (200만원~)
- 반복 업무 자동화
- 데이터 처리
- 리포트 생성

지금 사용하시는 이 챗봇도 저희 솔루션입니다! 😊
어떤 업무를 자동화하고 싶으신가요?`;
        }

        // 가격/견적
        if (this.matchKeywords(lower, ['가격', '얼마', '비용', '견적', '예산'])) {
            return `견적 문의 감사합니다! 💰

정확한 견적을 위해 몇 가지 여쭤볼게요:

1️⃣ 어떤 서비스가 필요하신가요?
   (웹사이트/앱/AI/디자인)

2️⃣ 원하시는 기능이나 참고 사이트가 있으신가요?

3️⃣ 희망하시는 예산 범위가 있으신가요?

편하게 말씀해주시면 맞춤 견적 드리겠습니다! 😊`;
        }

        // 포트폴리오
        if (this.matchKeywords(lower, ['포트폴리오', '작업물', '사례', '레퍼런스'])) {
            return `작업 사례가 궁금하시군요! 📂

저희는 다양한 프로젝트를 진행했습니다:

✅ 100+ 웹사이트 제작
✅ 50+ 앱 개발
✅ 30+ AI 프로젝트
✅ 200+ 디자인 프로젝트

관심 있는 분야의 포트폴리오를 보여드릴까요?
또는 연락처 남겨주시면 상세 자료 보내드릴게요!`;
        }

        // 연락처/상담
        if (this.matchKeywords(lower, ['연락', '전화', '상담', '예약', '담당자'])) {
            return `상담 예약을 원하시는군요! 📞

연락처를 남겨주시면 담당자가 연락드리겠습니다.

📧 이메일: contact@muse.studio
📞 전화: 02-1234-5678
💬 카카오톡: muse_studio

성함과 연락처를 남겨주시면 빠르게 연락드릴게요! 😊`;
        }

        // 감사
        if (this.matchKeywords(lower, ['감사', '고마워', 'thanks', '땡큐'])) {
            return this.randomResponse([
                '감사합니다! 😊 더 궁금한 점 있으시면 언제든 물어보세요!',
                '천만에요! 좋은 하루 되세요! 🌟'
            ]);
        }

        // 주문/계약
        if (this.matchKeywords(lower, ['주문', '발주', '진행', '계약', '시작'])) {
            return `프로젝트 진행을 원하시는군요! 🎉

주문 접수를 위해 정보를 알려주세요:

1️⃣ 담당자 성함
2️⃣ 연락처 (이메일/전화번호)
3️⃣ 원하시는 서비스
4️⃣ 간단한 요구사항

입력해주시면 담당자가 확인 후 연락드리겠습니다!`;
        }

        // 이름 입력 감지
        if (lower.length < 10 && !lower.includes(' ') && !this.matchKeywords(lower, ['네', '예', '아니'])) {
            // 이름처럼 보이면
            return `${userMessage}님, 반갑습니다! 😊

연락받으실 이메일이나 전화번호를 알려주시겠어요?`;
        }

        // 이메일 감지
        if (userMessage.includes('@')) {
            return `이메일 확인했습니다! ✅

전화번호도 알려주시면 더 빠르게 연락드릴 수 있어요.
(예: 010-1234-5678)`;
        }

        // 전화번호 감지
        if (/01[0-9][-\s]?\d{3,4}[-\s]?\d{4}/.test(userMessage)) {
            return `연락처 확인했습니다! ✅

마지막으로, 어떤 서비스가 필요하신지 간단히 말씀해주시겠어요?
(예: 회사 홈페이지 제작, 쇼핑몰 앱 개발 등)`;
        }

        // 기본 응답
        return this.randomResponse([
            `말씀 감사합니다! 😊

더 자세히 안내드릴게요. 혹시 아래 중 관심 있는 분야가 있으신가요?

🌐 웹사이트 제작
📱 앱 개발
🤖 AI 솔루션
🎨 디자인`,

            `네, 이해했습니다! 👍

정확한 상담을 위해 담당자 연결을 도와드릴까요?
연락처 남겨주시면 빠르게 연락드리겠습니다!`,

            `문의 감사합니다! 😊

조금 더 구체적으로 말씀해주시면 맞춤 안내 드릴게요.
예를 들어, 원하시는 서비스나 예산을 알려주세요!`
        ]);
    },

    // 유틸리티
    matchKeywords(text, keywords) {
        return keywords.some(k => text.includes(k));
    },

    randomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    },

    // 컨텍스트 기반 빠른 응답
    showContextualReplies(userMessage, botResponse) {
        const lower = botResponse.toLowerCase();

        if (lower.includes('어떤 서비스') || lower.includes('관심')) {
            this.showQuickReplies(['웹사이트', '앱 개발', 'AI 솔루션', '디자인']);
        } else if (lower.includes('견적') || lower.includes('예산')) {
            this.showQuickReplies(['Basic 패키지', 'Professional', '맞춤 견적', '상담 예약']);
        } else if (lower.includes('연락처') || lower.includes('담당자')) {
            this.showQuickReplies(['이메일 남기기', '전화 상담', '카카오톡 상담']);
        } else if (lower.includes('포트폴리오')) {
            this.showQuickReplies(['웹 포트폴리오', '앱 포트폴리오', 'AI 사례']);
        } else {
            this.showQuickReplies(['서비스 안내', '견적 문의', '상담 예약']);
        }
    },

    // UI 메서드들
    addUserMessage(text) {
        const container = document.getElementById('chatbot-messages');
        const time = this.formatTime(new Date());

        const messageEl = document.createElement('div');
        messageEl.className = 'message user';
        messageEl.innerHTML = `${this.escapeHtml(text)}<div class="time">${time}</div>`;

        container.appendChild(messageEl);
        this.scrollToBottom();
    },

    addBotMessage(text) {
        const container = document.getElementById('chatbot-messages');
        const time = this.formatTime(new Date());

        // Markdown 스타일 변환
        const formattedText = this.formatMessage(text);

        const messageEl = document.createElement('div');
        messageEl.className = 'message bot';
        messageEl.innerHTML = `${formattedText}<div class="time">${time}</div>`;

        container.appendChild(messageEl);
        this.scrollToBottom();
    },

    formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    showQuickReplies(replies) {
        const container = document.getElementById('quick-replies');
        container.innerHTML = '';

        replies.forEach(reply => {
            const btn = document.createElement('button');
            btn.className = 'quick-reply';
            btn.textContent = reply;
            btn.onclick = () => {
                container.innerHTML = '';
                this.addUserMessage(reply);
                this.processMessage(reply);
            };
            container.appendChild(btn);
        });
    },

    showTyping() {
        const container = document.getElementById('chatbot-messages');
        const typingEl = document.createElement('div');
        typingEl.id = 'typing-indicator';
        typingEl.className = 'typing-indicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingEl);
        this.scrollToBottom();
    },

    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    },

    scrollToBottom() {
        const container = document.getElementById('chatbot-messages');
        container.scrollTop = container.scrollHeight;
    },

    formatTime(date) {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    },

    // 히스토리 관리
    saveHistory() {
        localStorage.setItem('muse_ai_history', JSON.stringify(this.conversationHistory.slice(-20)));
    },

    loadHistory() {
        const saved = localStorage.getItem('muse_ai_history');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
        }
    }
};

// 전역 객체 (기존 MuseBot과 호환)
window.MuseBot = MuseAIBot;

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    MuseAIBot.init();
});
