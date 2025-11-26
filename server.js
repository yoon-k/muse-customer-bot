/**
 * MUSE Customer Bot - Simple Local Server
 * 로컬 테스트용 간단한 서버
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MUSE Customer Bot is running!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🤖 MUSE Customer Bot                                       ║
║                                                              ║
║   Server running at: http://localhost:${PORT}                  ║
║   Admin panel: http://localhost:${PORT}/admin.html             ║
║                                                              ║
║   Press Ctrl+C to stop                                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});
