-- Cloudflare D1 Database Schema for Global Challenge Activity & Real-time Live Feed

CREATE TABLE IF NOT EXISTS challenge_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL, -- 'post_completed' | 'day_finished'
    post_number INTEGER,      -- 1, 2, 3
    post_title TEXT,          -- 글 제목 (선택)
    category TEXT,            -- 카테고리 (IT, 맛집, 일상 등)
    nickname TEXT DEFAULT '익명의 러너',
    date_str TEXT NOT NULL,   -- YYYY-MM-DD (KST)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_challenge_date ON challenge_events(date_str);
CREATE INDEX IF NOT EXISTS idx_challenge_type ON challenge_events(event_type);
CREATE INDEX IF NOT EXISTS idx_challenge_created ON challenge_events(created_at DESC);
