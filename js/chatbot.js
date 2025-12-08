/**
 * MUSE Customer Bot - Core Chatbot Logic
 * 챗봇 핵심 로직 (다국어 지원)
 */

const MuseBot = {
    // 상태
    isOpen: false,
    sessionId: null,
    conversationState: 'idle', // idle, quoting, ordering
    currentQuote: null,
    orderData: {},
    orderStep: 0,
    conversationHistory: [],

    // AI 설정
    aiConfig: {
        enabled: false,  // AI 모드 활성화 여부
        apiKey: null,    // OpenAI API Key
        model: 'gpt-4o-mini',
        fallbackToAI: true,  // 규칙 기반 응답 못 찾으면 AI 사용
        systemPrompt: `You are MUSE Studio's friendly customer service assistant. You help customers with:
- Web development services (from $400)
- App development (from $2,500)
- AI solutions (from $800)
- Design services (from $250)

Be helpful, professional but friendly. Answer in the customer's language.
For pricing inquiries, guide them to request a quote.
Keep responses concise (2-3 sentences max).`
    },

    // 초기화
    init() {
        this.sessionId = this.generateSessionId();
        this.loadAIConfig();
        console.log('MUSE Customer Bot initialized', this.aiConfig.enabled ? '(AI Mode)' : '(Rule-based Mode)');
    },

    // AI 설정 로드
    loadAIConfig() {
        const savedKey = localStorage.getItem('muse_openai_key');
        if (savedKey) {
            this.aiConfig.apiKey = savedKey;
            this.aiConfig.enabled = true;
        }
    },

    // AI 모드 설정
    setAIMode(apiKey) {
        if (apiKey) {
            this.aiConfig.apiKey = apiKey;
            this.aiConfig.enabled = true;
            localStorage.setItem('muse_openai_key', apiKey);
            console.log('AI Mode enabled');
        } else {
            this.aiConfig.apiKey = null;
            this.aiConfig.enabled = false;
            localStorage.removeItem('muse_openai_key');
            console.log('AI Mode disabled');
        }
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
        const container = document.getElementById('chatbot-messages');
        container.innerHTML = '';

        const quickReplies = document.getElementById('quick-replies');
        if (quickReplies) quickReplies.innerHTML = '';

        localStorage.removeItem('muse_chat_history');

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

    // 견적 문의와 함께 열기 (다국어)
    openWithQuote(packageName) {
        this.open();
        setTimeout(() => {
            const msg = I18N.t('messages.quoteInquiry').replace('{package}', packageName);
            this.addUserMessage(msg);
            this.processMessage(msg);
        }, 500);
    },

    // 환영 메시지 (다국어)
    showWelcome() {
        const welcome = I18N.t('chatbot.welcome');
        const quickReplies = I18N.t('chatbot.quickReplies');

        this.addBotMessage(welcome);
        this.showQuickReplies(quickReplies);
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
    async processMessage(message) {
        if (this.conversationState === 'ordering') {
            this.processOrderStep(message);
            return;
        }

        if (this.conversationState === 'quoting') {
            this.processQuoteStep(message);
            return;
        }

        this.showTyping();

        // 대화 기록에 추가
        this.conversationHistory.push({ role: 'user', content: message });

        try {
            let response;

            // AI 모드가 활성화되어 있으면 AI 우선 사용
            if (this.aiConfig.enabled) {
                response = await this.getAIResponse(message);
            } else {
                // 규칙 기반 응답 찾기
                response = this.findResponse(message);

                // 규칙 기반 응답이 기본값이고, AI 폴백이 활성화되어 있으면 AI 시도
                if (response.isDefault && this.aiConfig.fallbackToAI && this.aiConfig.apiKey) {
                    const aiResponse = await this.getAIResponse(message);
                    if (aiResponse && !aiResponse.isError) {
                        response = aiResponse;
                    }
                }
            }

            this.hideTyping();
            this.addBotMessage(response.text);

            // 대화 기록에 봇 응답 추가
            this.conversationHistory.push({ role: 'assistant', content: response.text });

            if (response.quickReplies) {
                this.showQuickReplies(response.quickReplies);
            }

            if (response.action) {
                this.executeAction(response.action, message);
            }
        } catch (error) {
            this.hideTyping();
            console.error('Message processing error:', error);
            const fallbackResponse = this.findResponse(message);
            this.addBotMessage(fallbackResponse.text);
            if (fallbackResponse.quickReplies) {
                this.showQuickReplies(fallbackResponse.quickReplies);
            }
        }
    },

    // AI API 호출
    async getAIResponse(message) {
        if (!this.aiConfig.apiKey) {
            return null;
        }

        const lang = I18N.currentLang;
        const langNames = { ko: 'Korean', en: 'English', ja: 'Japanese', zh: 'Chinese' };

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.aiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: this.aiConfig.model,
                    messages: [
                        {
                            role: 'system',
                            content: this.aiConfig.systemPrompt + `\n\nRespond in ${langNames[lang] || 'English'}.`
                        },
                        ...this.conversationHistory.slice(-10) // 최근 10개 메시지만 전송
                    ],
                    max_tokens: 200,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.choices[0]?.message?.content || '';

            // 빠른 응답 버튼 생성
            const quickReplies = this.generateQuickRepliesFromContext(aiText, lang);

            return {
                text: aiText,
                quickReplies,
                isAI: true
            };
        } catch (error) {
            console.error('AI API error:', error);
            return {
                text: '',
                isError: true
            };
        }
    },

    // 컨텍스트에 따른 빠른 응답 버튼 생성
    generateQuickRepliesFromContext(response, lang) {
        const lowerResponse = response.toLowerCase();
        const quickRepliesMap = {
            ko: {
                pricing: ['웹사이트', '앱 개발', 'AI 솔루션', '견적 받기'],
                service: ['서비스 보기', '견적 문의', '상담원 연결'],
                default: ['서비스 보기', '견적 받기', '연락하기']
            },
            en: {
                pricing: ['Website', 'App Dev', 'AI Solutions', 'Get Quote'],
                service: ['View Services', 'Get Quote', 'Contact Us'],
                default: ['Services', 'Get Quote', 'Contact']
            },
            ja: {
                pricing: ['ウェブサイト', 'アプリ開発', 'AIソリューション', '見積もり'],
                service: ['サービス一覧', '見積もり依頼', 'お問い合わせ'],
                default: ['サービス', '見積もり', 'お問い合わせ']
            },
            zh: {
                pricing: ['网站', '应用开发', 'AI解决方案', '获取报价'],
                service: ['查看服务', '获取报价', '联系我们'],
                default: ['服务', '报价', '联系']
            }
        };

        const replies = quickRepliesMap[lang] || quickRepliesMap.en;

        if (lowerResponse.includes('price') || lowerResponse.includes('cost') ||
            lowerResponse.includes('가격') || lowerResponse.includes('비용')) {
            return replies.pricing;
        }

        if (lowerResponse.includes('service') || lowerResponse.includes('help') ||
            lowerResponse.includes('서비스') || lowerResponse.includes('도움')) {
            return replies.service;
        }

        return replies.default;
    },

    // 응답 찾기 (다국어 패턴 지원)
    findResponse(message) {
        const lowerMessage = message.toLowerCase();
        const lang = I18N.currentLang;

        // 각 카테고리 검색
        for (const [key, data] of Object.entries(RESPONSES)) {
            if (key === 'default') continue;

            // 다국어 패턴 확인
            const patterns = data.patterns_i18n?.[lang] || data.patterns || [];

            if (patterns.some(p => lowerMessage.includes(p.toLowerCase()))) {
                // 다국어 응답 선택
                const responses = data.responses_i18n?.[lang] || data.responses || [];
                const quickReplies = data.quickReplies_i18n?.[lang] || data.quickReplies || [];

                return {
                    text: this.getRandomItem(responses),
                    quickReplies,
                    action: data.action
                };
            }
        }

        // 기본 응답 (다국어)
        const defaultData = RESPONSES.default;
        const responses = defaultData.responses_i18n?.[lang] || defaultData.responses || [];
        const quickReplies = defaultData.quickReplies_i18n?.[lang] || defaultData.quickReplies || [];

        return {
            text: this.getRandomItem(responses),
            quickReplies,
            isDefault: true  // 기본 응답임을 표시 (AI 폴백 용도)
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

        for (const [id, product] of Object.entries(PRODUCTS)) {
            if (lowerMessage.includes(product.name.toLowerCase()) ||
                lowerMessage.includes(id.toLowerCase())) {

                this.currentQuote.products.push(product);
                this.showQuoteCard();
                return;
            }
        }

        // 확정 키워드 (다국어)
        const confirmKeywords = {
            ko: ['확정', '진행', '주문'],
            en: ['confirm', 'proceed', 'order'],
            ja: ['確定', '進める', '注文'],
            zh: ['确定', '进行', '订单']
        };

        const cancelKeywords = {
            ko: ['취소', '처음'],
            en: ['cancel', 'start over'],
            ja: ['キャンセル', '最初'],
            zh: ['取消', '重新']
        };

        const lang = I18N.currentLang;

        if (confirmKeywords[lang]?.some(k => lowerMessage.includes(k))) {
            this.conversationState = 'ordering';
            this.startOrder();
            return;
        }

        if (cancelKeywords[lang]?.some(k => lowerMessage.includes(k))) {
            this.conversationState = 'idle';
            this.currentQuote = null;

            const cancelMsgs = {
                ko: '견적을 취소했습니다. 다른 도움이 필요하신가요?',
                en: 'Quote cancelled. Is there anything else I can help with?',
                ja: '見積もりをキャンセルしました。他にお手伝いできることはありますか？',
                zh: '报价已取消。还有什么可以帮您的吗？'
            };

            this.addBotMessage(cancelMsgs[lang] || cancelMsgs.en);
            this.showQuickReplies(I18N.t('chatbot.quickReplies'));
            return;
        }

        const selectMsgs = {
            ko: '어떤 서비스를 선택하시겠어요?',
            en: 'Which service would you like?',
            ja: 'どのサービスをご希望ですか？',
            zh: '您想选择哪项服务？'
        };

        this.addBotMessage(selectMsgs[lang] || selectMsgs.en);
        this.showQuickReplies(['Basic', 'Professional', 'Enterprise']);
    },

    // 견적 카드 표시
    showQuoteCard() {
        let total = 0;
        let itemsHtml = '';
        const lang = I18N.currentLang;

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

        const quoteLabels = {
            ko: { title: '📋 견적서', total: '총 금액', ready: '견적이 준비되었습니다! 💰' },
            en: { title: '📋 Quote', total: 'Total', ready: 'Your quote is ready! 💰' },
            ja: { title: '📋 見積書', total: '合計金額', ready: 'お見積もりの準備ができました！💰' },
            zh: { title: '📋 报价单', total: '总金额', ready: '报价已准备好！💰' }
        };

        const labels = quoteLabels[lang] || quoteLabels.en;

        const quoteHtml = `
            <div class="quote-card">
                <h4>${labels.title}</h4>
                ${itemsHtml}
                <div class="quote-total">
                    <span>${labels.total}</span>
                    <span>${this.formatPrice(total)}</span>
                </div>
            </div>
        `;

        this.addBotMessage(labels.ready + quoteHtml);

        const quickReplies = {
            ko: ['옵션 추가', '견적 확정', '상담원 연결'],
            en: ['Add options', 'Confirm quote', 'Contact agent'],
            ja: ['オプション追加', '見積確定', '担当者へ'],
            zh: ['添加选项', '确认报价', '联系客服']
        };

        this.showQuickReplies(quickReplies[lang] || quickReplies.en);
    },

    // 주문 시작
    startOrder() {
        this.conversationState = 'ordering';
        this.orderStep = 0;
        this.orderData = {};
        this.askOrderInfo();
    },

    // 주문 정보 요청 (다국어)
    askOrderInfo() {
        const lang = I18N.currentLang;
        const steps = ['collectName', 'collectEmail', 'collectPhone', 'collectDetails'];
        const currentStep = steps[this.orderStep];

        const prompts = {
            collectName: {
                ko: '담당자 성함을 알려주세요.',
                en: 'Please tell me your name.',
                ja: 'ご担当者様のお名前を教えてください。',
                zh: '请告诉我您的姓名。'
            },
            collectEmail: {
                ko: '이메일 주소를 알려주세요.',
                en: 'Please enter your email address.',
                ja: 'メールアドレスを教えてください。',
                zh: '请输入您的邮箱地址。'
            },
            collectPhone: {
                ko: '연락처를 알려주세요.',
                en: 'Please enter your phone number.',
                ja: '電話番号を教えてください。',
                zh: '请输入您的电话号码。'
            },
            collectDetails: {
                ko: '추가로 전달할 내용이 있으시면 말씀해주세요. (없으면 "없음")',
                en: 'Any additional details? (type "none" if not)',
                ja: '追加の詳細があればお聞かせください。（なければ「なし」）',
                zh: '还有其他详细信息吗？（没有请输入"无"）'
            }
        };

        if (currentStep) {
            const prompt = prompts[currentStep][lang] || prompts[currentStep].en;
            this.addBotMessage(prompt);
        } else {
            this.confirmOrder();
        }
    },

    // 주문 단계 처리
    processOrderStep(message) {
        const steps = ['collectName', 'collectEmail', 'collectPhone', 'collectDetails'];
        const currentStep = steps[this.orderStep];
        const lang = I18N.currentLang;

        // 유효성 검사
        const errorMessages = {
            collectEmail: {
                ko: '올바른 이메일 형식을 입력해주세요.',
                en: 'Please enter a valid email address.',
                ja: '正しいメールアドレスを入力してください。',
                zh: '请输入有效的邮箱地址。'
            },
            collectPhone: {
                ko: '올바른 연락처를 입력해주세요.',
                en: 'Please enter a valid phone number.',
                ja: '正しい電話番号を入力してください。',
                zh: '请输入有效的电话号码。'
            }
        };

        if (currentStep === 'collectEmail' && !message.includes('@')) {
            this.addBotMessage(errorMessages.collectEmail[lang] || errorMessages.collectEmail.en);
            return;
        }

        if (currentStep === 'collectPhone' && message.length < 8) {
            this.addBotMessage(errorMessages.collectPhone[lang] || errorMessages.collectPhone.en);
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

    // 주문 확인 (다국어)
    confirmOrder() {
        const orderNumber = 'ORD' + Date.now().toString(36).toUpperCase();
        const lang = I18N.currentLang;

        const labels = {
            ko: { title: '📦 주문 정보 확인', orderNo: '주문번호', name: '담당자', email: '이메일', phone: '연락처', amount: '견적 금액' },
            en: { title: '📦 Order Confirmation', orderNo: 'Order No.', name: 'Name', email: 'Email', phone: 'Phone', amount: 'Quote Amount' },
            ja: { title: '📦 注文情報確認', orderNo: '注文番号', name: '担当者', email: 'メール', phone: '電話番号', amount: '見積金額' },
            zh: { title: '📦 订单信息确认', orderNo: '订单号', name: '姓名', email: '邮箱', phone: '电话', amount: '报价金额' }
        };

        const l = labels[lang] || labels.en;

        const confirmHtml = `
            <div class="quote-card">
                <h4>${l.title}</h4>
                <div class="quote-item">
                    <span>${l.orderNo}</span>
                    <span>${orderNumber}</span>
                </div>
                <div class="quote-item">
                    <span>${l.name}</span>
                    <span>${this.orderData.name}</span>
                </div>
                <div class="quote-item">
                    <span>${l.email}</span>
                    <span>${this.orderData.email}</span>
                </div>
                <div class="quote-item">
                    <span>${l.phone}</span>
                    <span>${this.orderData.phone}</span>
                </div>
                ${this.currentQuote ? `
                <div class="quote-total">
                    <span>${l.amount}</span>
                    <span>${this.formatPrice(this.currentQuote.total)}</span>
                </div>
                ` : ''}
            </div>
        `;

        const successMsgs = {
            ko: `주문이 접수되었습니다! 🎉${confirmHtml}\n\n담당자가 빠른 시일 내에 연락드리겠습니다.`,
            en: `Order submitted! 🎉${confirmHtml}\n\nWe will contact you shortly.`,
            ja: `ご注文を承りました！🎉${confirmHtml}\n\n担当者より早急にご連絡いたします。`,
            zh: `订单已提交！🎉${confirmHtml}\n\n我们将尽快与您联系。`
        };

        this.addBotMessage(successMsgs[lang] || successMsgs.en);

        this.saveOrder({
            orderNumber,
            ...this.orderData,
            quote: this.currentQuote,
            language: lang,
            createdAt: new Date().toISOString()
        });

        this.conversationState = 'idle';
        this.orderStep = 0;
        this.orderData = {};
        this.currentQuote = null;

        this.showQuickReplies(I18N.t('chatbot.quickReplies'));
    },

    // 주문 저장
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

        if (!Array.isArray(replies)) return;

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
        if (history.length > 50) history.shift();
        localStorage.setItem('muse_chat_history', JSON.stringify(history));
    },

    // 유틸리티
    getRandomItem(arr) {
        if (!Array.isArray(arr) || arr.length === 0) return '';
        return arr[Math.floor(Math.random() * arr.length)];
    },

    formatPrice(price) {
        const lang = I18N.currentLang;
        const formats = {
            ko: { locale: 'ko-KR', suffix: '원' },
            en: { locale: 'en-US', prefix: '$', divisor: 1000 },
            ja: { locale: 'ja-JP', prefix: '¥', divisor: 100 },
            zh: { locale: 'zh-CN', prefix: '¥', divisor: 100 }
        };

        const fmt = formats[lang] || formats.ko;
        let amount = price;

        if (fmt.divisor) {
            amount = Math.round(price / fmt.divisor);
        }

        const formatted = amount.toLocaleString(fmt.locale);

        if (fmt.prefix) {
            return fmt.prefix + formatted;
        }
        return formatted + (fmt.suffix || '');
    },

    formatTime(date) {
        return date.toLocaleTimeString(I18N.currentLang === 'ko' ? 'ko-KR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    MuseBot.init();
});
