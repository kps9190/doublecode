import ColorSwatchInput from "../ui/ColorSwatchInput";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function SmallColorInput({ value, onChange }: Props) {
    return <ColorSwatchInput value={value} ariaLabel="Gradient color" onChange={onChange} className="h-7 w-9" />;
}
