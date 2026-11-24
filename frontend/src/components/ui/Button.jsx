export default function Button({
    children,
    variant = "primary",
    type = "button",
    ...props}) {
    const variantStyles = {
        primary:
            "bg-primary text-on-primary enabled:hover:bg-primary-hover",
        secondary:
            "bg-secondary text-on-secondary enabled:hover:bg-secondary-hover",
    };

  return (
    <button
      {...props}
      type={type}
      className={`rounded-xl px-6 py-2 my-2 font-semibold
        enabled:hover:shadow-md focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-focus
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}`}
    >
      {children}
    </button>
  );
}