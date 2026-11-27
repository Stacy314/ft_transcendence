import './ui.css';

// One field: label, input, and its error message (linked for screen readers).
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
  // Keep any caller-provided description linked alongside the validation error.
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
