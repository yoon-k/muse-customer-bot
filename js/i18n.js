/**
 * MUSE Customer Bot - Internationalization (i18n)
 * 다국어 지원 시스템
 */

const I18N = {
    // 현재 언어
    currentLang: 'ko',

    // 지원 언어
    languages: {
        ko: { name: '한국어', flag: '🇰🇷' },
        en: { name: 'English', flag: '🇺🇸' },
        ja: { name: '日本語', flag: '🇯🇵' },
        zh: { name: '中文', flag: '🇨🇳' }
    },

    // 번역 데이터
    translations: {
        ko: {
            // 네비게이션
            nav: {
                services: '서비스',
                portfolio: '포트폴리오',
                pricing: '가격',
                contact: '문의'
            },
            // 히어로 섹션
            hero: {
                title: '비즈니스를 위한',
                titleHighlight: '맞춤형 솔루션',
                subtitle: '웹사이트, 앱, AI 솔루션까지<br>전문가가 함께합니다',
                cta: '무료 상담 시작하기'
            },
            // 서비스 섹션
            services: {
                title: '서비스',
                web: {
                    title: '웹사이트 제작',
                    desc: '반응형 웹사이트, 쇼핑몰, 랜딩페이지',
                    price: '50만원~'
                },
                app: {
                    title: '앱 개발',
                    desc: 'iOS, Android 네이티브 및 크로스플랫폼',
                    price: '300만원~'
                },
                ai: {
                    title: 'AI 솔루션',
                    desc: '챗봇, 자동화, 데이터 분석',
                    price: '100만원~'
                },
                design: {
                    title: '디자인',
                    desc: 'UI/UX, 브랜딩, 그래픽 디자인',
                    price: '30만원~'
                }
            },
            // 가격 섹션
            pricing: {
                title: '가격 안내',
                subtitle: '프로젝트 규모에 따라 맞춤 견적을 제공합니다',
                popular: '인기',
                getQuote: '견적 받기',
                consultation: '상담 요청',
                custom: '맞춤 견적',
                basic: {
                    name: 'Basic',
                    price: '50만원~',
                    features: ['5페이지 이내', '반응형 디자인', '기본 SEO', '1개월 무료 유지보수']
                },
                professional: {
                    name: 'Professional',
                    price: '150만원~',
                    features: ['10페이지 이내', '프리미엄 디자인', '고급 SEO + 애널리틱스', '관리자 페이지', '3개월 무료 유지보수']
                },
                enterprise: {
                    name: 'Enterprise',
                    features: ['무제한 페이지', '커스텀 기능 개발', 'API 연동', '전담 매니저', '12개월 유지보수']
                }
            },
            // 푸터
            footer: {
                copyright: '© 2024 MUSE Studio. 챗봇으로 언제든 문의하세요!'
            },
            // 챗봇
            chatbot: {
                name: 'MUSE 상담봇',
                status: '온라인',
                placeholder: '메시지를 입력하세요...',
                welcome: '안녕하세요! 무엇을 도와드릴까요? 😊',
                quickReplies: ['웹사이트 제작', '앱 개발', 'AI 솔루션', '견적 문의']
            },
            // 주문/견적 메시지
            messages: {
                quoteInquiry: '{package} 패키지 견적 문의합니다',
                enterpriseInquiry: 'Enterprise 맞춤 견적 문의합니다'
            }
        },

        en: {
            nav: {
                services: 'Services',
                portfolio: 'Portfolio',
                pricing: 'Pricing',
                contact: 'Contact'
            },
            hero: {
                title: 'Custom Solutions',
                titleHighlight: 'For Your Business',
                subtitle: 'Website, App, AI Solutions<br>Expert team at your service',
                cta: 'Start Free Consultation'
            },
            services: {
                title: 'Services',
                web: {
                    title: 'Web Development',
                    desc: 'Responsive websites, E-commerce, Landing pages',
                    price: 'From $400'
                },
                app: {
                    title: 'App Development',
                    desc: 'iOS, Android native & cross-platform',
                    price: 'From $2,500'
                },
                ai: {
                    title: 'AI Solutions',
                    desc: 'Chatbots, Automation, Data Analytics',
                    price: 'From $800'
                },
                design: {
                    title: 'Design',
                    desc: 'UI/UX, Branding, Graphic Design',
                    price: 'From $250'
                }
            },
            pricing: {
                title: 'Pricing',
                subtitle: 'Custom quotes based on project scope',
                popular: 'Popular',
                getQuote: 'Get Quote',
                consultation: 'Request Consultation',
                custom: 'Custom Quote',
                basic: {
                    name: 'Basic',
                    price: 'From $400',
                    features: ['Up to 5 pages', 'Responsive design', 'Basic SEO', '1 month free maintenance']
                },
                professional: {
                    name: 'Professional',
                    price: 'From $1,200',
                    features: ['Up to 10 pages', 'Premium design', 'Advanced SEO + Analytics', 'Admin panel', '3 months free maintenance']
                },
                enterprise: {
                    name: 'Enterprise',
                    features: ['Unlimited pages', 'Custom development', 'API integration', 'Dedicated manager', '12 months maintenance']
                }
            },
            footer: {
                copyright: '© 2024 MUSE Studio. Contact us anytime via chatbot!'
            },
            chatbot: {
                name: 'MUSE Bot',
                status: 'Online',
                placeholder: 'Type a message...',
                welcome: 'Hello! How can I help you? 😊',
                quickReplies: ['Web Development', 'App Development', 'AI Solutions', 'Get Quote']
            },
            messages: {
                quoteInquiry: 'I would like a quote for {package} package',
                enterpriseInquiry: 'I would like a custom Enterprise quote'
            }
        },

        ja: {
            nav: {
                services: 'サービス',
                portfolio: 'ポートフォリオ',
                pricing: '料金',
                contact: 'お問い合わせ'
            },
            hero: {
                title: 'ビジネスのための',
                titleHighlight: 'カスタムソリューション',
                subtitle: 'ウェブサイト、アプリ、AIソリューション<br>専門家がサポートします',
                cta: '無料相談を始める'
            },
            services: {
                title: 'サービス',
                web: {
                    title: 'ウェブサイト制作',
                    desc: 'レスポンシブサイト、EC、ランディングページ',
                    price: '¥50,000~'
                },
                app: {
                    title: 'アプリ開発',
                    desc: 'iOS、Android ネイティブ＆クロスプラットフォーム',
                    price: '¥300,000~'
                },
                ai: {
                    title: 'AIソリューション',
                    desc: 'チャットボット、自動化、データ分析',
                    price: '¥100,000~'
                },
                design: {
                    title: 'デザイン',
                    desc: 'UI/UX、ブランディング、グラフィック',
                    price: '¥30,000~'
                }
            },
            pricing: {
                title: '料金案内',
                subtitle: 'プロジェクト規模に応じたカスタム見積もり',
                popular: '人気',
                getQuote: '見積もり',
                consultation: '相談する',
                custom: 'カスタム見積',
                basic: {
                    name: 'Basic',
                    price: '¥50,000~',
                    features: ['5ページ以内', 'レスポンシブ', '基本SEO', '1ヶ月無料保守']
                },
                professional: {
                    name: 'Professional',
                    price: '¥150,000~',
                    features: ['10ページ以内', 'プレミアムデザイン', '高度なSEO+アナリティクス', '管理画面', '3ヶ月無料保守']
                },
                enterprise: {
                    name: 'Enterprise',
                    features: ['無制限ページ', 'カスタム開発', 'API連携', '専任マネージャー', '12ヶ月保守']
                }
            },
            footer: {
                copyright: '© 2024 MUSE Studio. チャットボットでいつでもお問い合わせください！'
            },
            chatbot: {
                name: 'MUSE ボット',
                status: 'オンライン',
                placeholder: 'メッセージを入力...',
                welcome: 'こんにちは！何かお手伝いできますか？😊',
                quickReplies: ['ウェブ制作', 'アプリ開発', 'AIソリューション', '見積もり']
            },
            messages: {
                quoteInquiry: '{package}パッケージの見積もりをお願いします',
                enterpriseInquiry: 'Enterpriseカスタム見積もりをお願いします'
            }
        },

        zh: {
            nav: {
                services: '服务',
                portfolio: '作品集',
                pricing: '价格',
                contact: '联系'
            },
            hero: {
                title: '为您的业务提供',
                titleHighlight: '定制解决方案',
                subtitle: '网站、应用、AI解决方案<br>专业团队为您服务',
                cta: '开始免费咨询'
            },
            services: {
                title: '服务',
                web: {
                    title: '网站开发',
                    desc: '响应式网站、电商、落地页',
                    price: '¥3,000起'
                },
                app: {
                    title: '应用开发',
                    desc: 'iOS、Android原生及跨平台',
                    price: '¥20,000起'
                },
                ai: {
                    title: 'AI解决方案',
                    desc: '聊天机器人、自动化、数据分析',
                    price: '¥6,000起'
                },
                design: {
                    title: '设计',
                    desc: 'UI/UX、品牌、平面设计',
                    price: '¥2,000起'
                }
            },
            pricing: {
                title: '价格说明',
                subtitle: '根据项目规模提供定制报价',
                popular: '热门',
                getQuote: '获取报价',
                consultation: '咨询',
                custom: '定制报价',
                basic: {
                    name: 'Basic',
                    price: '¥3,000起',
                    features: ['5页以内', '响应式设计', '基础SEO', '1个月免费维护']
                },
                professional: {
                    name: 'Professional',
                    price: '¥10,000起',
                    features: ['10页以内', '高级设计', '高级SEO+分析', '管理后台', '3个月免费维护']
                },
                enterprise: {
                    name: 'Enterprise',
                    features: ['无限页面', '定制开发', 'API集成', '专属经理', '12个月维护']
                }
            },
            footer: {
                copyright: '© 2024 MUSE Studio. 随时通过聊天机器人联系我们！'
            },
            chatbot: {
                name: 'MUSE 客服',
                status: '在线',
                placeholder: '输入消息...',
                welcome: '您好！有什么可以帮您？😊',
                quickReplies: ['网站开发', '应用开发', 'AI解决方案', '获取报价']
            },
            messages: {
                quoteInquiry: '我想咨询{package}套餐的报价',
                enterpriseInquiry: '我想咨询Enterprise定制报价'
            }
        }
    },

    // 초기화
    init() {
        // 브라우저 언어 감지 또는 저장된 언어 사용
        const savedLang = localStorage.getItem('muse_lang');
        const browserLang = navigator.language.split('-')[0];

        if (savedLang && this.languages[savedLang]) {
            this.currentLang = savedLang;
        } else if (this.languages[browserLang]) {
            this.currentLang = browserLang;
        }

        this.applyTranslations();
        this.createLanguageSelector();
    },

    // 언어 변경
    setLanguage(lang) {
        if (!this.languages[lang]) return;

        this.currentLang = lang;
        localStorage.setItem('muse_lang', lang);
        this.applyTranslations();

        // HTML lang 속성 변경
        document.documentElement.lang = lang;
    },

    // 번역 가져오기
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                // fallback to Korean
                value = this.translations['ko'];
                for (const k2 of keys) {
                    if (value && value[k2]) {
                        value = value[k2];
                    } else {
                        return key;
                    }
                }
                return value;
            }
        }

        return value;
    },

    // 번역 적용
    applyTranslations() {
        // data-i18n 속성이 있는 모든 요소에 번역 적용
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            if (el.tagName === 'INPUT') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation;
            }
        });

        // 언어 선택기 업데이트
        const selector = document.getElementById('lang-selector-current');
        if (selector) {
            const lang = this.languages[this.currentLang];
            selector.innerHTML = `${lang.flag} ${lang.name}`;
        }
    },

    // 언어 선택기 생성
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'lang-selector';
        selector.innerHTML = `
            <button id="lang-selector-current" class="lang-btn">
                ${this.languages[this.currentLang].flag} ${this.languages[this.currentLang].name}
            </button>
            <div class="lang-dropdown" id="lang-dropdown">
                ${Object.entries(this.languages).map(([code, lang]) => `
                    <button class="lang-option ${code === this.currentLang ? 'active' : ''}" data-lang="${code}">
                        ${lang.flag} ${lang.name}
                    </button>
                `).join('')}
            </div>
        `;

        // 네비게이션에 추가
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(selector);
        }

        // 이벤트 바인딩
        const btn = selector.querySelector('.lang-btn');
        const dropdown = selector.querySelector('.lang-dropdown');

        btn.onclick = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        };

        selector.querySelectorAll('.lang-option').forEach(option => {
            option.onclick = (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                this.setLanguage(lang);
                dropdown.classList.remove('show');

                // active 클래스 업데이트
                selector.querySelectorAll('.lang-option').forEach(opt => {
                    opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
                });
            };
        });

        // 외부 클릭 시 닫기
        document.addEventListener('click', () => {
            dropdown.classList.remove('show');
        });
    }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    I18N.init();
});
