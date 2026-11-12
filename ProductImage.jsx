// Renders an uploaded image if present, otherwise a generated illustration
// (gradient + emoji) so there are never any broken or missing images.
export default function ProductImage({ product, className = '', emojiSize = 'text-6xl' }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  }
  const c = product.color || '#f97316';
  return (
    <div
      role="img"
      aria-label={product.name}
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${c}22 0%, ${c}55 100%)` }}
    >
      <div
        className="absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-30"
        style={{ background: c }}
      />
      <div
        className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full opacity-20"
        style={{ background: c }}
      />
      <span className={`relative drop-shadow-md transition-transform duration-300 group-hover:scale-110 ${emojiSize}`}>
        {product.emoji || '🍽️'}
      </span>
    </div>
  );
}
