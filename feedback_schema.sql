-- Cloudflare D1 Database Schema for Feature Request & Upvoting Board

CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'feature', -- 'feature' (기능제안), 'improvement' (편의성 개선), 'bug' (버그제보)
    author TEXT DEFAULT '익명의 블로거',
    status TEXT DEFAULT 'under_review', -- 'under_review' (검토중), 'planned' (개발예정), 'in_progress' (개발중), 'completed' (반영완료)
    upvotes INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feedback_id INTEGER NOT NULL,
    voter_token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(feedback_id, voter_token)
);

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_upvotes ON feedback(upvotes DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);
