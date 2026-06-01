PRAGMA foreign_keys = OFF;
DELETE FROM feedback_comment_revisions;
DELETE FROM feedback_comments;
DELETE FROM sqlite_sequence WHERE name = 'feedback_comment_revisions';
DELETE FROM sqlite_sequence WHERE name = 'feedback_comments';
PRAGMA foreign_keys = ON;

INSERT INTO feedback_comments
    (id, parent_id, author_name, author_role, password_hash, body, status, ip_hash, user_agent, created_at, updated_at, edit_count, deleted_at)
VALUES
    (1, NULL, '민', 'user', 'mock_hash_1234', '모바일에서 QR이랑 바코드를 같이 볼 수 있어서 편해요.', 'visible', 'mock_ip_001', 'Mock Safari iOS', '2026-06-01 09:10:00', NULL, 0, NULL),
    (2, 1, '개발자', 'owner', 'mock_owner_hash', '좋게 봐주셔서 감사합니다. 모바일 흐름은 계속 다듬어볼게요.', 'visible', 'mock_ip_owner', 'Mock Admin Browser', '2026-06-01 09:18:00', NULL, 0, NULL),
    (3, 2, '민', 'user', 'mock_hash_1234', '좋아요. 다운로드 파일명도 지금처럼 구분되면 충분합니다.', 'visible', 'mock_ip_001', 'Mock Safari iOS', '2026-06-01 09:22:00', NULL, 0, NULL),

    (4, NULL, '지나', 'user', 'mock_hash_5678', '색상 고급설정에서 기본값으로 돌아오는 동작이 자연스러워졌어요.', 'visible', 'mock_ip_002', 'Mock Chrome Android', '2026-06-01 10:05:00', '2026-06-01 10:20:00', 1, NULL),
    (5, 4, '테스터', 'user', 'mock_hash_2468', '저도 이 부분 헷갈렸는데 지금은 이해하기 쉽네요.', 'visible', 'mock_ip_003', 'Mock Chrome Desktop', '2026-06-01 10:11:00', NULL, 0, NULL),

    (6, NULL, 'olduser', 'user', 'mock_hash_old', '이 댓글은 답글이 있어서 삭제되어도 자리만 남아야 합니다.', 'deleted', 'mock_ip_004', 'Mock Firefox', '2026-06-01 11:00:00', NULL, 0, '2026-06-01 11:20:00'),
    (7, 6, '나래', 'user', 'mock_hash_1357', '삭제된 부모 댓글 아래의 답글 예시입니다.', 'visible', 'mock_ip_005', 'Mock Safari macOS', '2026-06-01 11:07:00', NULL, 0, NULL),
    (8, 7, '개발자', 'owner', 'mock_owner_hash', '부모 댓글은 삭제 표시로 남기고 답글은 유지하는 정책입니다.', 'visible', 'mock_ip_owner', 'Mock Admin Browser', '2026-06-01 11:12:00', NULL, 0, NULL),

    (9, NULL, '수현', 'user', 'mock_hash_9999', 'EAN2, EAN5 조건 안내처럼 바코드별 경고가 구체적이면 좋겠습니다.', 'visible', 'mock_ip_006', 'Mock Edge', '2026-06-01 12:30:00', NULL, 0, NULL),

    (10, NULL, '삭제됨', 'user', 'mock_hash_gone', '답글이 없는 삭제 댓글은 API 응답에서 제외되어야 합니다.', 'deleted', 'mock_ip_007', 'Mock Chrome', '2026-06-01 13:00:00', NULL, 0, '2026-06-01 13:02:00'),
    (11, NULL, '숨김', 'user', 'mock_hash_hide', '관리자 숨김 처리된 댓글 예시입니다.', 'hidden', 'mock_ip_008', 'Mock Browser', '2026-06-01 13:30:00', NULL, 0, NULL);

INSERT INTO feedback_comment_revisions
    (comment_id, revision_type, revision_no, previous_body, new_body, edited_at, ip_hash, user_agent)
SELECT
    id,
    'create',
    0,
    NULL,
    CASE
        WHEN id = 4 THEN '색상 고급설정에서 기본값으로 돌아오는 동작이 헷갈렸어요.'
        ELSE body
    END,
    created_at,
    ip_hash,
    user_agent
FROM feedback_comments;

INSERT INTO feedback_comment_revisions
    (comment_id, revision_type, revision_no, previous_body, new_body, edited_at, ip_hash, user_agent)
VALUES
    (
        4,
        'update',
        1,
        '색상 고급설정에서 기본값으로 돌아오는 동작이 헷갈렸어요.',
        '색상 고급설정에서 기본값으로 돌아오는 동작이 자연스러워졌어요.',
        '2026-06-01 10:20:00',
        'mock_ip_002',
        'Mock Chrome Android'
    );

SELECT seq FROM sqlite_sequence WHERE name = 'feedback_comments';
