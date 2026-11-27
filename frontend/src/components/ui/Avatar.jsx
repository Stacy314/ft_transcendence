export default function Avatar({ src, alt, size = 'lg' }) {
  const sizeStyles = {
    sm: 'h-16 w-16 border-2',
    md: 'h-24 w-24 border-4',
    lg: 'h-42 w-42 border-6',
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover border-6 border-white ${sizeStyles[size]}`}
    />
  );
}
