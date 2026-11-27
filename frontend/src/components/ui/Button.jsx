import './ui.css';

export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  busy = false,
  disabled = false,
  ...props
}) {
  // Disable the button while a request is running to prevent repeat submissions.
  return (
    <button
      type={type}
      className={`ui-button ui-button-${variant} ${className}`.trim()}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...props}
    />
  );
}
