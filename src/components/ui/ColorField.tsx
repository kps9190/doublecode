import FieldRow from "./FieldRow";
import ColorSwatchInput from "./ColorSwatchInput";

interface Props { label: string; value: string; onChange: (v: string) => void }

export default function ColorField({ label, value, onChange }: Props) {
    return (
        <FieldRow label={label}>
            <ColorSwatchInput value={value} ariaLabel={label} onChange={onChange} className="h-7 w-10" />
        </FieldRow>
    );
}
