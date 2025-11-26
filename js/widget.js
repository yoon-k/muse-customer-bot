/**
 * MUSE Customer Bot - Embeddable Widget
 * 다른 웹사이트에 삽입 가능한 위젯
 *
 * 사용법:
 * <script src="https://yoon-k.github.io/muse-customer-bot/js/widget.js"></script>
 * <script>
 *   MuseBot.init({
 *     position: 'bottom-right',
 *     primaryColor: '#2563eb',
 *     greeting: '안녕하세요!'
 *   });
 * </script>
 */

(function() {
    'use strict';

    // CDN URL (GitHub Pages)
    const CDN_BASE = 'https://yoon-k.github.io/muse-customer-bot/frontend';

    // 기본 설정
    const defaultConfig = {
        position: 'bottom-right', // bottom-right, bottom-left
        primaryColor: '#2563eb',
        greeting: '안녕하세요! 무엇을 도와드릴까요?',
        botName: 'MUSE 상담봇',
        companyName: 'MUSE Studio'
    };

    // 위젯 스타일 주입
    function injectStyles(config) {
        const style = document.createElement('style');
        style.textContent = `
            #muse-bot-widget {
                position: fixed;
                ${config.position === 'bottom-left' ? 'left: 24px;' : 'right: 24px;'}
                bottom: 24px;
                z-index: 99999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            }

            #muse-bot-toggle {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: ${config.primaryColor};
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-size: 24px;
                transition: transform 0.3s;
            }

            #muse-bot-toggle:hover {
                transform: scale(1.1);
            }

            #muse-bot-window {
                position: absolute;
                bottom: 76px;
                ${config.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
                width: 380px;
                height: 520px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }

            #muse-bot-window.open {
                display: flex;
            }

            #muse-bot-header {
                background: ${config.primaryColor};
                color: white;
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }

            #muse-bot-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }

            .muse-message {
                max-width: 80%;
                padding: 10px 14px;
                margin-bottom: 8px;
                border-radius: 12px;
                font-size: 14px;
                line-height: 1.4;
            }

            .muse-message.bot {
                background: #f3f4f6;
                align-self: flex-start;
            }

            .muse-message.user {
                background: ${config.primaryColor};
                color: white;
                margin-left: auto;
            }

            #muse-bot-input-area {
                padding: 12px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 8px;
            }

            #muse-bot-input {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid #e5e7eb;
                border-radius: 20px;
                outline: none;
                font-size: 14px;
            }

            #muse-bot-send {
                width: 40px;
                height: 40px;
                background: ${config.primaryColor};
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
            }

            @media (max-width: 480px) {
                #muse-bot-window {
                    width: calc(100vw - 48px);
                    height: 60vh;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // 위젯 HTML 생성
    function createWidget(config) {
        const widget = document.createElement('div');
        widget.id = 'muse-bot-widget';
        widget.innerHTML = `
            <button id="muse-bot-toggle">💬</button>
            <div id="muse-bot-window">
                <div id="muse-bot-header">
                    <div style="font-size: 20px;">🤖</div>
                    <div>
                        <div style="font-weight: 600;">${config.botName}</div>
                        <div style="font-size: 12px; opacity: 0.9;">온라인</div>
                    </div>
                </div>
                <div id="muse-bot-messages"></div>
                <div id="muse-bot-input-area">
                    <input id="muse-bot-input" type="text" placeholder="메시지 입력...">
                    <button id="muse-bot-send">➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);

        // 이벤트 바인딩
        document.getElementById('muse-bot-toggle').onclick = toggleWidget;
        document.getElementById('muse-bot-send').onclick = sendMessage;
        document.getElementById('muse-bot-input').onkeypress = (e) => {
            if (e.key === 'Enter') sendMessage();
        };

        // 환영 메시지
        setTimeout(() => {
            addMessage(config.greeting, 'bot');
        }, 1000);
    }

    function toggleWidget() {
        const window = document.getElementById('muse-bot-window');
        window.classList.toggle('open');
    }

    function sendMessage() {
        const input = document.getElementById('muse-bot-input');
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        // 간단한 응답
        setTimeout(() => {
            const response = getResponse(text);
            addMessage(response, 'bot');
        }, 800);
    }

    function addMessage(text, type) {
        const container = document.getElementById('muse-bot-messages');
        const msg = document.createElement('div');
        msg.className = `muse-message ${type}`;
        msg.textContent = text;
        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function getResponse(text) {
        const lower = text.toLowerCase();
        if (lower.includes('안녕') || lower.includes('hello')) {
            return '안녕하세요! 무엇을 도와드릴까요? 😊';
        }
        if (lower.includes('가격') || lower.includes('견적')) {
            return '견적 문의 감사합니다! 어떤 서비스가 필요하신가요? (웹사이트/앱/AI)';
        }
        if (lower.includes('웹')) {
            return '웹사이트 제작은 50만원부터 시작합니다. 자세한 상담을 원하시면 연락처를 남겨주세요!';
        }
        return '문의 감사합니다! 담당자가 확인 후 연락드리겠습니다. 📞';
    }

    // 전역 객체
    window.MuseBot = {
        init: function(userConfig) {
            const config = { ...defaultConfig, ...userConfig };
            injectStyles(config);
            createWidget(config);
        },
        open: function() {
            document.getElementById('muse-bot-window').classList.add('open');
        },
        close: function() {
            document.getElementById('muse-bot-window').classList.remove('open');
        }
    };
})();
