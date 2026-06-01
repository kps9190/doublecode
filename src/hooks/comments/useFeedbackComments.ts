import { useCallback, useEffect, useMemo, useState } from "react";
import { COMMENT_LIMITS, isValidCommentUpdate, isValidNewComment, normalizeCommentDraft } from "../../domain/comments/commentRules";
import { FeedbackCommentService } from "../../services/comments";
import type { FeedbackComment } from "../../types/comments";

export function useFeedbackComments() {
    const service = useMemo(() => new FeedbackCommentService(), []);
    const [comments, setComments] = useState<FeedbackComment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            setComments(await service.list());
        } catch {
            setError("comments.loadError");
        } finally {
            setLoading(false);
        }
    }, [service]);

    const runMutation = useCallback(async (mutation: () => Promise<void>, errorKey?: string) => {
        setSubmitting(true);
        setError(null);

        try {
            await mutation();
            return true;
        } catch {
            if (errorKey) setError(errorKey);
            return false;
        } finally {
            setSubmitting(false);
        }
    }, []);

    const submit = useCallback(async (authorName: string, password: string, body: string, parentId: string | null = null) => {
        if (!isValidNewComment(authorName, password, body)) return false;

        const draft = normalizeCommentDraft(authorName, password, body);

        return runMutation(async () => {
            await service.create({
                authorName: draft.authorName,
                password: draft.password,
                body: draft.body,
                parentId,
            });
            await load();
        }, "comments.submitError");
    }, [load, runMutation, service]);

    const remove = useCallback(async (id: string, password: string) => {
        if (!password) return false;

        return runMutation(async () => {
            await service.delete(id, { password });
            await load();
        }, "comments.deleteError");
    }, [load, runMutation, service]);

    const verifyPassword = useCallback(async (id: string, password: string) => {
        if (!password) return false;

        return runMutation(async () => {
            await service.verifyPassword(id, { password });
        });
    }, [runMutation, service]);

    const update = useCallback(async (id: string, password: string, body: string) => {
        if (!isValidCommentUpdate(password, body)) return false;

        return runMutation(async () => {
            await service.update(id, { password, body: body.trim() });
            await load();
        }, "comments.updateError");
    }, [load, runMutation, service]);

    useEffect(() => {
        void load();
    }, [load]);

    return {
        comments,
        loading,
        submitting,
        error,
        maxCommentLength: COMMENT_LIMITS.body,
        reload: load,
        remove,
        submit,
        update,
        verifyPassword,
    };
}
