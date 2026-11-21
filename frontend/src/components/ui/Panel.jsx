import './ui.css';

export default function Panel({
  as: Element = 'div',
  variant = 'rounded',
  className = '',
  ...props
}) {
  return (
    <Element
      className={`ui-panel ui-panel-${variant} ${className}`.trim()}
      {...props}
    />
  );
}
