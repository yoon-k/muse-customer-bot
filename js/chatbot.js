/**
 * MUSE Customer Bot - Core Chatbot Logic
 * 챗봇 핵심 로직
 */

const MuseBot = {
    // 상태
    isOpen: false,
    sessionId: null,
    conversationState: 'idle', // idle, quoting, ordering
    currentQuote: null,
    orderData: {},
    orderStep: 0,

    // 초기화
    init() {
        this.sessionId = this.generateSessionId();
        // 닫을 때 대화가 지워지므로 loadConversation 불필요
        console.log('MUSE Customer Bot initialized');
    },

    // 세션 ID 생성
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // 위젯 토글
    toggle() {
        this.isOpen ? this.close() : this.open();
    },

    // 열기
    open() {
        this.isOpen = true;
        document.getElementById('chatbot-widget').classList.add('open');

        if (!this.hasMessages()) {
            this.showWelcome();
        }
    },

    // 닫기
    close() {
        this.isOpen = false;
        document.getElementById('chatbot-widget').classList.remove('open');
        this.clearConversation();
    },

    // 대화 초기화
    clearConversation() {
        // 화면의 메시지 삭제
        const container = document.getElementById('chatbot-messages');
        container.innerHTML = '';

        // 빠른 응답 버튼 삭제
        const quickReplies = document.getElementById('quick-replies');
        if (quickReplies) quickReplies.innerHTML = '';

        // LocalStorage 대화 기록 삭제
        localStorage.removeItem('muse_chat_history');

        // 상태 초기화
        this.conversationState = 'idle';
        this.currentQuote = null;
        this.orderData = {};
        this.orderStep = 0;
        this.sessionId = this.generateSessionId();
    },

    // 메시지와 함께 열기
    openWithMessage(message) {
        this.open();
        setTimeout(() => {
            this.processMessage(message);
        }, 500);
    },

    // 환영 메시지
    showWelcome() {
        this.addBotMessage(CONFIG.welcomeMessage);
        this.showQuickReplies(['웹사이트 제작', '앱 개발', 'AI 솔루션', '견적 문의']);
    },

    // 메시지 있는지 확인
    hasMessages() {
        const container = document.getElementById('chatbot-messages');
        return container.children.length > 0;
    },

    // 사용자 메시지 전송
    sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();

        if (!message) return;

        input.value = '';
        this.addUserMessage(message);
        this.processMessage(message);
    },

    // 메시지 처리
    processMessage(message) {
        // 주문 진행 중
        if (this.conversationState === 'ordering') {
            this.processOrderStep(message);
            return;
        }

        // 견적 진행 중
        if (this.conversationState === 'quoting') {
            this.processQuoteStep(message);
            return;
        }

        // 일반 대화
        this.showTyping();

        setTimeout(() => {
            this.hideTyping();
            const response = this.findResponse(message);
            this.addBotMessage(response.text);

            if (response.quickReplies) {
                this.showQuickReplies(response.quickReplies);
            }

            if (response.action) {
                this.executeAction(response.action, message);
            }
        }, CONFIG.typingDelay);
    },

    // 응답 찾기
    findResponse(message) {
        const lowerMessage = message.toLowerCase();

        // 각 카테고리 검색
        for (const [key, data] of Object.entries(RESPONSES)) {
            if (key === 'default') continue;

            if (data.patterns && data.patterns.some(p => lowerMessage.includes(p))) {
                const text = this.getRandomItem(data.responses);
                return {
                    text,
                    quickReplies: data.quickReplies,
                    action: data.action
                };
            }
        }

        // 기본 응답
        return {
            text: this.getRandomItem(RESPONSES.default.responses),
            quickReplies: RESPONSES.default.quickReplies
        };
    },

    // 액션 실행
    executeAction(action, message) {
        switch (action) {
            case 'startQuote':
                this.startQuote();
                break;
            case 'startOrder':
                this.startOrder();
                break;
        }
    },

    // 견적 시작
    startQuote() {
        this.conversationState = 'quoting';
        this.currentQuote = {
            products: [],
            options: [],
            total: 0
        };
    },

    // 견적 처리
    processQuoteStep(message) {
        const lowerMessage = message.toLowerCase();

        // 상품 선택
        for (const [id, product] of Object.entries(PRODUCTS)) {
            if (lowerMessage.includes(product.name.toLowerCase()) ||
                lowerMessage.includes(id.toLowerCase())) {

                this.currentQuote.products.push(product);
                this.showQuoteCard();
                return;
            }
        }

        // 견적 확정
        if (lowerMessage.includes('확정') || lowerMessage.includes('진행') || lowerMessage.includes('주문')) {
            this.conversationState = 'ordering';
            this.startOrder();
            return;
        }

        // 취소
        if (lowerMessage.includes('취소') || lowerMessage.includes('처음')) {
            this.conversationState = 'idle';
            this.currentQuote = null;
            this.addBotMessage('견적을 취소했습니다. 다른 도움이 필요하신가요?');
            this.showQuickReplies(['서비스 보기', '처음으로']);
            return;
        }

        // 인식 실패
        this.addBotMessage('어떤 서비스를 선택하시겠어요?');
        this.showQuickReplies(['Basic 웹사이트', 'Professional', '쇼핑몰', '앱 개발']);
    },

    // 견적 카드 표시
    showQuoteCard() {
        let total = 0;
        let itemsHtml = '';

        this.currentQuote.products.forEach(product => {
            total += product.basePrice;
            itemsHtml += `
                <div class="quote-item">
                    <span>${product.name}</span>
                    <span>${this.formatPrice(product.basePrice)}</span>
                </div>
            `;
        });

        this.currentQuote.options.forEach(option => {
            const opt = OPTIONS[option];
            if (opt) {
                total += opt.price;
                itemsHtml += `
                    <div class="quote-item">
                        <span>${opt.name}</span>
                        <span>${this.formatPrice(opt.price)}</span>
                    </div>
                `;
            }
        });

        this.currentQuote.total = total;

        const quoteHtml = `
            <div class="quote-card">
                <h4>📋 견적서</h4>
                ${itemsHtml}
                <div class="quote-total">
                    <span>총 금액</span>
                    <span>${this.formatPrice(total)}</span>
                </div>
            </div>
        `;

        this.addBotMessage('견적이 준비되었습니다! 💰' + quoteHtml);
        this.showQuickReplies(['옵션 추가', '견적 확정', '상담원 연결']);
    },

    // 주문 시작
    startOrder() {
        this.conversationState = 'ordering';
        this.orderStep = 0;
        this.orderData = {};
        this.askOrderInfo();
    },

    // 주문 정보 요청
    askOrderInfo() {
        const steps = ['collectName', 'collectEmail', 'collectPhone', 'collectDetails'];
        const currentStep = steps[this.orderStep];

        if (currentStep) {
            const prompt = ORDER_PROMPTS[currentStep];
            this.addBotMessage(prompt.prompt);
        } else {
            this.confirmOrder();
        }
    },

    // 주문 단계 처리
    processOrderStep(message) {
        const steps = ['collectName', 'collectEmail', 'collectPhone', 'collectDetails'];
        const currentStep = steps[this.orderStep];
        const prompt = ORDER_PROMPTS[currentStep];

        // 유효성 검사
        if (prompt && !prompt.validate(message)) {
            this.addBotMessage(prompt.errorMessage);
            return;
        }

        // 데이터 저장
        switch (currentStep) {
            case 'collectName':
                this.orderData.name = message;
                break;
            case 'collectEmail':
                this.orderData.email = message;
                break;
            case 'collectPhone':
                this.orderData.phone = message;
                break;
            case 'collectDetails':
                this.orderData.details = message;
                break;
        }

        this.orderStep++;
        this.askOrderInfo();
    },

    // 주문 확인
    confirmOrder() {
        const orderNumber = 'ORD' + Date.now().toString(36).toUpperCase();

        const confirmHtml = `
            <div class="quote-card">
                <h4>📦 주문 정보 확인</h4>
                <div class="quote-item">
                    <span>주문번호</span>
                    <span>${orderNumber}</span>
                </div>
                <div class="quote-item">
                    <span>담당자</span>
                    <span>${this.orderData.name}</span>
                </div>
                <div class="quote-item">
                    <span>이메일</span>
                    <span>${this.orderData.email}</span>
                </div>
                <div class="quote-item">
                    <span>연락처</span>
                    <span>${this.orderData.phone}</span>
                </div>
                ${this.currentQuote ? `
                <div class="quote-total">
                    <span>견적 금액</span>
                    <span>${this.formatPrice(this.currentQuote.total)}</span>
                </div>
                ` : ''}
            </div>
        `;

        this.addBotMessage(`주문이 접수되었습니다! 🎉${confirmHtml}\n\n담당자가 빠른 시일 내에 연락드리겠습니다.\n이메일로 상세 안내가 발송됩니다.`);

        // 주문 저장
        this.saveOrder({
            orderNumber,
            ...this.orderData,
            quote: this.currentQuote,
            createdAt: new Date().toISOString()
        });

        // 상태 초기화
        this.conversationState = 'idle';
        this.orderStep = 0;
        this.orderData = {};
        this.currentQuote = null;

        this.showQuickReplies(['다른 서비스 보기', '처음으로']);
    },

    // 주문 저장 (LocalStorage)
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('muse_orders') || '[]');
        orders.push(order);
        localStorage.setItem('muse_orders', JSON.stringify(orders));
        console.log('Order saved:', order);
    },

    // 사용자 메시지 추가
    addUserMessage(text) {
        const container = document.getElementById('chatbot-messages');
        const time = this.formatTime(new Date());

        const messageEl = document.createElement('div');
        messageEl.className = 'message user';
        messageEl.innerHTML = `
            ${text}
            <div class="time">${time}</div>
        `;

        container.appendChild(messageEl);
        this.scrollToBottom();
        this.saveMessage('user', text);
    },

    // 봇 메시지 추가
    addBotMessage(text) {
        const container = document.getElementById('chatbot-messages');
        const time = this.formatTime(new Date());

        const messageEl = document.createElement('div');
        messageEl.className = 'message bot';
        messageEl.innerHTML = `
            ${text}
            <div class="time">${time}</div>
        `;

        container.appendChild(messageEl);
        this.scrollToBottom();
        this.saveMessage('bot', text);
    },

    // 빠른 응답 버튼 표시
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

    // 타이핑 표시
    showTyping() {
        const container = document.getElementById('chatbot-messages');
        const typingEl = document.createElement('div');
        typingEl.id = 'typing-indicator';
        typingEl.className = 'typing-indicator';
        typingEl.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingEl);
        this.scrollToBottom();
    },

    // 타이핑 숨기기
    hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    },

    // 스크롤
    scrollToBottom() {
        const container = document.getElementById('chatbot-messages');
        container.scrollTop = container.scrollHeight;
    },

    // 대화 저장
    saveMessage(role, text) {
        const history = JSON.parse(localStorage.getItem('muse_chat_history') || '[]');
        history.push({
            role,
            text,
            timestamp: new Date().toISOString()
        });
        // 최근 50개만 유지
        if (history.length > 50) history.shift();
        localStorage.setItem('muse_chat_history', JSON.stringify(history));
    },

    // 대화 불러오기
    loadConversation() {
        const history = JSON.parse(localStorage.getItem('muse_chat_history') || '[]');
        const container = document.getElementById('chatbot-messages');

        // 최근 10개만 표시
        history.slice(-10).forEach(msg => {
            const messageEl = document.createElement('div');
            messageEl.className = `message ${msg.role}`;
            messageEl.innerHTML = `
                ${msg.text}
                <div class="time">${this.formatTime(new Date(msg.timestamp))}</div>
            `;
            container.appendChild(messageEl);
        });
    },

    // 유틸리티
    getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    formatPrice(price) {
        return price.toLocaleString('ko-KR') + '원';
    },

    formatTime(date) {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    MuseBot.init();
});
