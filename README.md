# MUSE Customer Bot

🤖 AI-Powered Customer Service Chatbot | AI 기반 고객응대 챗봇

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Demo](https://img.shields.io/badge/Demo-Live-blue.svg)](https://yoon-k.github.io/muse-customer-bot/)

## 🚀 One-Click Install | 원클릭 설치

```bash
# Clone & Setup (한 줄로 끝!)
git clone https://github.com/yoon-k/muse-customer-bot.git && cd muse-customer-bot && ./setup.sh
```

**Windows:**
```cmd
git clone https://github.com/yoon-k/muse-customer-bot.git
cd muse-customer-bot
install.bat
```

## ✨ Features | 주요 기능

### 🤖 AI Chatbot
- **Multiple AI Providers**: OpenAI, Hugging Face (Free), Cloudflare Workers AI (Free)
- **Demo Mode**: Smart responses without API key
- **Natural Language**: Context-aware conversations

### 💰 Quote System | 견적 시스템
- Real-time price calculation
- Option-based pricing
- Automatic discount application

### 📦 Order Processing | 발주 처리
- Conversational order intake
- Customer info collection
- Order confirmation

### 📊 Admin Dashboard | 관리자 대시보드
- Chat history
- Order management
- Data export

## 🎯 Demo

**[Live Demo](https://yoon-k.github.io/muse-customer-bot/)** - Try it now!

![Demo Screenshot](https://via.placeholder.com/800x400/2563eb/ffffff?text=MUSE+Customer+Bot)

## 📁 Project Structure

```
muse-customer-bot/
├── index.html              # Main page with chatbot widget
├── admin.html              # Admin dashboard
├── css/
│   └── style.css           # Styles
├── js/
│   ├── config.js           # Products & pricing config
│   ├── responses.js        # Response templates
│   ├── chatbot.js          # Rule-based chatbot
│   ├── ai-chatbot.js       # AI-powered chatbot ⭐
│   └── widget.js           # Embeddable widget
├── scripts/
│   └── setup.js            # Cross-platform setup
├── server.js               # Local dev server
├── setup.sh                # Mac/Linux installer
├── install.bat             # Windows installer
└── package.json
```

## 🔧 Quick Start

### Option 1: GitHub Pages (Easiest - Free)

1. Fork this repository
2. Go to Settings > Pages > Source: `main` branch
3. Access at `https://[username].github.io/muse-customer-bot/`

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/yoon-k/muse-customer-bot.git
cd muse-customer-bot

# Install dependencies
npm install

# Start server
npm start

# Open http://localhost:3000
```

### Option 3: npx (No install needed)

```bash
npx serve frontend
# Open http://localhost:3000
```

## 🤖 AI Configuration

### Demo Mode (Default - No API key needed)
```javascript
MuseAIBot.setProvider('demo');
```

### OpenAI (Best quality)
```javascript
MuseAIBot.setProvider('openai');
MuseAIBot.setApiKey('sk-your-api-key');
```

### Hugging Face (Free)
```javascript
MuseAIBot.setProvider('huggingface');
// Optional: MuseAIBot.setApiKey('hf_your-token');
```

### Cloudflare Workers AI (Free)
```javascript
MuseAIBot.setProvider('cloudflare');
// Requires Cloudflare account setup
```

## 📦 Embedding in Your Website

```html
<!-- Add to any website -->
<script src="https://yoon-k.github.io/muse-customer-bot/js/widget.js"></script>
<script>
  MuseBot.init({
    position: 'bottom-right',
    primaryColor: '#2563eb',
    greeting: '안녕하세요! 무엇을 도와드릴까요?'
  });
</script>
```

## ⚙️ Customization

### Products & Pricing (`js/config.js`)

```javascript
const PRODUCTS = {
    'web-basic': {
        id: 'web-basic',
        name: '웹사이트 기본형',
        basePrice: 500000,
        description: '5페이지 기본 웹사이트',
        features: ['반응형 디자인', '기본 SEO', '문의 폼']
    },
    // Add more products...
};
```

### Response Templates (`js/responses.js`)

```javascript
const RESPONSES = {
    greeting: {
        patterns: ['안녕', 'hello', 'hi'],
        responses: [
            '안녕하세요! 무엇을 도와드릴까요? 😊',
            '환영합니다! 어떤 서비스가 필요하신가요?'
        ]
    },
    // Add more responses...
};
```

### AI System Prompt (`js/ai-chatbot.js`)

```javascript
MuseAIBot.config.businessContext = `
당신은 [회사명]의 AI 고객상담 챗봇입니다.
[서비스 설명]
[가격 정보]
`;
```

## 🛠 Tech Stack

| Layer | Technology | Cost |
|-------|------------|------|
| Frontend | HTML/CSS/JavaScript | Free |
| Hosting | GitHub Pages | Free |
| AI (Option 1) | Demo Mode | Free |
| AI (Option 2) | Hugging Face API | Free |
| AI (Option 3) | Cloudflare Workers AI | Free (100k/day) |
| AI (Option 4) | OpenAI API | Paid |
| Storage | LocalStorage | Free |
| Server | Node.js Express | Self-hosted |

## 📊 Admin Panel

Access admin dashboard at `/admin.html`:
- View all orders
- Browse chat history
- Export data as JSON
- Clear data

## 🔒 Privacy

- All data stored locally (LocalStorage)
- No server-side logging by default
- No personal data in source code
- Users control their own data

## 📄 License

MIT License - Use freely for any purpose

## 🏢 About MUSE Studio

AI-powered solutions for modern businesses.

---

Made with ❤️ by MUSE Studio
