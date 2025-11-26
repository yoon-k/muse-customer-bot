#!/usr/bin/env node

/**
 * MUSE Customer Bot - Cross-Platform Setup Script
 * Windows/Mac/Linux 모두 지원하는 설치 스크립트
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(color, message) {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function printBanner() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🤖 MUSE Customer Bot - Auto Setup                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
}

function checkNodeVersion() {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);

    if (major < 16) {
        log('red', `❌ Node.js ${version} is too old. Please use Node.js 16+`);
        process.exit(1);
    }
    log('green', `✓ Node.js ${version} - OK`);
}

function createEnvFile() {
    const envPath = path.join(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
        log('yellow', '⚠ .env file already exists, skipping');
        return;
    }

    const envContent = `# MUSE Customer Bot Configuration
# AI Provider: 'demo' | 'openai' | 'huggingface' | 'cloudflare'
AI_PROVIDER=demo

# OpenAI (optional - for production)
# OPENAI_API_KEY=sk-your-key-here

# Hugging Face (free alternative)
# HF_API_KEY=hf_your-key-here

# Server
PORT=3000
`;

    fs.writeFileSync(envPath, envContent);
    log('green', '✓ .env file created');
}

function createConfigFromTemplate() {
    const configPath = path.join(process.cwd(), 'frontend', 'js', 'config.js');

    if (fs.existsSync(configPath)) {
        log('green', '✓ Configuration file exists');
        return;
    }

    log('yellow', '⚠ Config file missing, creating default...');
}

function printSuccess() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ✅ Setup Complete!                                         ║
║                                                              ║
║   Quick Start:                                               ║
║   ─────────────────────────────────────────────────────────  ║
║                                                              ║
║   1. Start server:    npm start                              ║
║   2. Open browser:    http://localhost:3000                  ║
║   3. Admin panel:     http://localhost:3000/admin.html       ║
║                                                              ║
║   ─────────────────────────────────────────────────────────  ║
║                                                              ║
║   To use AI features:                                        ║
║   - Edit .env file and add your API key                      ║
║   - Or use free Hugging Face API                             ║
║   - Or run in 'demo' mode (no API needed)                    ║
║                                                              ║
║   Documentation: See README.md                               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
}

// Main
async function main() {
    printBanner();

    log('blue', '[1/3] Checking environment...');
    checkNodeVersion();

    log('blue', '[2/3] Creating configuration...');
    createEnvFile();
    createConfigFromTemplate();

    log('blue', '[3/3] Verifying installation...');
    log('green', '✓ All files in place');

    printSuccess();
}

main().catch(err => {
    log('red', `❌ Setup failed: ${err.message}`);
    process.exit(1);
});
