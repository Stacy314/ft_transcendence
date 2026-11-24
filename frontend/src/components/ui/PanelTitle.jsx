import './ui.css';

export default function PanelTitle({
  as: Element = 'h1',
  className = '',
  ...props
}) {
  return (
    <Element className={`ui-panel-title ${className}`.trim()} {...props} />
  );
}
