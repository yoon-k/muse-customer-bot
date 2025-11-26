#!/bin/bash

# ╔══════════════════════════════════════════════════════════════╗
# ║   MUSE Customer Bot - One-Click Setup                        ║
# ╚══════════════════════════════════════════════════════════════╝

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   🤖 MUSE Customer Bot - Auto Setup                         ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}[1/4]${NC} Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found!${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

# Check npm
echo -e "${BLUE}[2/4]${NC} Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"

# Install dependencies
echo -e "${BLUE}[3/4]${NC} Installing dependencies..."
npm install --silent
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create .env file if not exists
echo -e "${BLUE}[4/4]${NC} Setting up configuration..."
if [ ! -f .env ]; then
    cat > .env << EOF
# MUSE Customer Bot Configuration
# AI Provider: 'demo' | 'openai' | 'huggingface' | 'cloudflare'
AI_PROVIDER=demo

# OpenAI (optional - for production)
# OPENAI_API_KEY=sk-your-key-here

# Hugging Face (free alternative)
# HF_API_KEY=hf_your-key-here

# Server
PORT=3000
EOF
    echo -e "${GREEN}✓ Configuration file created (.env)${NC}"
else
    echo -e "${YELLOW}⚠ .env already exists, skipping${NC}"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   ✅ Setup Complete!                                         ║"
echo "║                                                              ║"
echo "║   To start the server:                                       ║"
echo "║   $ npm start                                                ║"
echo "║                                                              ║"
echo "║   Then open: http://localhost:3000                          ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Ask to start server
read -p "Start server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm start
fi
