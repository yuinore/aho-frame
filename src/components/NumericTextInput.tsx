import Form from 'react-bootstrap/Form';

export interface NumericTextInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

export function NumericTextInput({
  value,
  onChange,
  className,
  style,
  'aria-label': ariaLabel,
}: NumericTextInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const n = parseFloat(value);
      const num = Number.isFinite(n) ? n : 0;
      onChange(String(num + 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const n = parseFloat(value);
      const num = Number.isFinite(n) ? n : 0;
      onChange(String(num - 1));
    }
  };

  return (
    <Form.Control
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={className}
      style={style}
      aria-label={ariaLabel}
    />
  );
}
