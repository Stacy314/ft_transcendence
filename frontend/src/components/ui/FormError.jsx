import './ui.css';

export default function FormError({ className = '', ...props }) {
  return (
    <p
      className={`ui-form-error ${className}`.trim()}
      role="alert"
      {...props}
    />
  );
}
