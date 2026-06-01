CREATE TABLE IF NOT EXISTS feedback_comments (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT REFERENCES feedback_comments(id) ON DELETE RESTRICT,
    author_name TEXT CHECK (author_name IS NULL OR length(author_name) <= 10),
    author_role TEXT NOT NULL DEFAULT 'user' CHECK (author_role IN ('user', 'owner')),
    password_hash TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible', 'deleted', 'hidden')),
    ip_hash TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ,
    edit_count INTEGER NOT NULL DEFAULT 0 CHECK (edit_count >= 0),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS feedback_comments_parent_created_at_idx
    ON feedback_comments (parent_id, created_at ASC);

CREATE INDEX IF NOT EXISTS feedback_comments_visible_created_at_idx
    ON feedback_comments (status, created_at DESC);

CREATE TABLE IF NOT EXISTS feedback_comment_revisions (
    id BIGSERIAL PRIMARY KEY,
    comment_id BIGINT NOT NULL REFERENCES feedback_comments(id) ON DELETE RESTRICT,
    revision_type TEXT NOT NULL CHECK (revision_type IN ('create', 'update')),
    revision_no INTEGER NOT NULL CHECK (revision_no >= 0),
    previous_body TEXT,
    new_body TEXT NOT NULL,
    edited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_hash TEXT,
    user_agent TEXT,
    UNIQUE (comment_id, revision_no)
);

CREATE INDEX IF NOT EXISTS feedback_comment_revisions_comment_edited_at_idx
    ON feedback_comment_revisions (comment_id, edited_at DESC);
