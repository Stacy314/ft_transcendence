import './ui.css';

export default function FormField({
  id,
  name = id,
  type = 'text',
  label,
  error,
  hidden = false,
  disabled = false,
  className = '',
  'aria-describedby': describedBy,
  'aria-invalid': invalid = false,
  ...inputProps
}) {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionIds = [describedBy, errorId].filter(Boolean).join(' ');

  return (
    <div
      className={`ui-form-field ${className}`.trim()}
      hidden={hidden}
      aria-hidden={hidden || undefined}
    >
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        disabled={disabled || hidden}
        aria-invalid={Boolean(error) || invalid}
        aria-describedby={descriptionIds || undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="ui-field-error">
          {error}
        </p>
      )}
    </div>
  );
}
