export default function Toast({ children, onDismiss }) {
  // Keep the live region mounted so screen readers pick up new messages.
  const hasMessage = Boolean(children);

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div
        className={
          hasMessage
            ? 'flex items-start gap-4 rounded-lg bg-surface-tinted p-4 text-foreground shadow-lg'
            : ''
        }
      >
        <div role="status">{children}</div>

        {hasMessage && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="rounded px-2 focus-visible:outline-2 focus-visible:outline-focus"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
