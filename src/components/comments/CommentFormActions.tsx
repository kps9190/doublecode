import UIButton from "../ui/UIButton";

interface Props {
    cancelLabel: string;
    disabled: boolean;
    primaryDisabled?: boolean;
    primaryLabel: string;
    onCancel: () => void;
    onPrimary: () => void;
}

export default function CommentFormActions({
    cancelLabel,
    disabled,
    primaryDisabled = false,
    primaryLabel,
    onCancel,
    onPrimary,
}: Props) {
    return (
        <div className="flex flex-nowrap items-center justify-end gap-2">
            <UIButton size="sm" disabled={disabled} onClick={onCancel} className="h-8 !w-auto whitespace-nowrap px-2.5 text-xs">
                {cancelLabel}
            </UIButton>
            <UIButton
                size="sm"
                variant="solid"
                disabled={disabled || primaryDisabled}
                onClick={onPrimary}
                className="h-8 !w-auto min-w-0 whitespace-nowrap px-2.5 text-xs"
            >
                {primaryLabel}
            </UIButton>
        </div>
    );
}
