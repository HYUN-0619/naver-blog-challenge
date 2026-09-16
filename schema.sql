-- Cloudflare D1 Database Schema for Visitor Logging

CREATE TABLE IF NOT EXISTS visitor_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_str TEXT NOT NULL
);

-- Indices for fast querying by date and unique IP
CREATE INDEX IF NOT EXISTS idx_visitor_date ON visitor_logs(date_str);
CREATE INDEX IF NOT EXISTS idx_visitor_ip_date ON visitor_logs(ip_hash, date_str);
