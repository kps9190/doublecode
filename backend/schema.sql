CREATE TABLE IF NOT EXISTS feedback_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER REFERENCES feedback_comments(id) ON DELETE RESTRICT,
    author_name TEXT CHECK (author_name IS NULL OR length(author_name) <= 10),
    author_role TEXT NOT NULL DEFAULT 'user' CHECK (author_role IN ('user', 'owner')),
    password_hash TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'deleted', 'hidden')),
    ip_hash TEXT,
    user_agent TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT,
    edit_count INTEGER NOT NULL DEFAULT 0 CHECK (edit_count >= 0),
    deleted_at TEXT
);

CREATE INDEX IF NOT EXISTS feedback_comments_parent_created_at_idx
    ON feedback_comments (parent_id, created_at ASC);

CREATE INDEX IF NOT EXISTS feedback_comments_visible_created_at_idx
    ON feedback_comments (status, created_at DESC);

CREATE TABLE IF NOT EXISTS feedback_comment_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL REFERENCES feedback_comments(id) ON DELETE RESTRICT,
    revision_type TEXT NOT NULL CHECK (revision_type IN ('create', 'update')),
    revision_no INTEGER NOT NULL CHECK (revision_no >= 0),
    previous_body TEXT,
    new_body TEXT NOT NULL,
    edited_at TEXT NOT NULL DEFAULT (datetime('now')),
    ip_hash TEXT,
    user_agent TEXT,
    UNIQUE (comment_id, revision_no)
);

CREATE INDEX IF NOT EXISTS feedback_comment_revisions_comment_edited_at_idx
    ON feedback_comment_revisions (comment_id, edited_at DESC);
