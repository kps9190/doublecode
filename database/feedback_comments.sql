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
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    edited_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_hash TEXT,
    user_agent TEXT,
    UNIQUE (comment_id, revision_no)
);

CREATE INDEX IF NOT EXISTS feedback_comment_revisions_comment_edited_at_idx
    ON feedback_comment_revisions (comment_id, edited_at DESC);

-- Expected API contract:
-- GET /api/comments
--   returns a visible tree:
--   [{ id, parentId, authorName, authorRole, body, deleted, createdAt, updatedAt, editCount, replies }]
--   deleted comments with replies should be returned with deleted=true and body omitted/replaced.
--   deleted comments without replies should be omitted from the tree.
-- POST /api/comments
--   public accepts { parentId?, authorName, password, body }
--   authorName is required and limited to 10 characters.
--   password is required, 4-20 characters before hashing.
--   server hashes password into password_hash; never store or return raw passwords.
--   returns { id, parentId, authorName, authorRole, body, deleted, createdAt, replies: [] }
--   also appends revision_type='create', revision_no=0 to feedback_comment_revisions.
-- DELETE /api/comments/:id
--   accepts { password }
--   if password matches and the comment has replies, set status='deleted', deleted_at=CURRENT_TIMESTAMP.
--   if password matches and the comment has no replies, also set status='deleted' and omit it from GET results.
-- PATCH /api/comments/:id
--   accepts { password, body }
--   if password matches, update body, set updated_at=CURRENT_TIMESTAMP, and increment edit_count.
--   before updating, append revision_type='update' to feedback_comment_revisions with previous_body and new_body.
--
-- Staff/owner impersonation rule:
--   The public POST endpoint must always write author_role='user'.
--   Only an authenticated admin-only endpoint/session may write author_role='owner'.
--   The frontend displays the developer badge only when authorRole === 'owner'.
