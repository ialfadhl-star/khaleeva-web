export default function Photo({ tone = 't1', image = '', className = '', style = {}, children }) {
  const hasImage = Boolean(image);
  return (
    <div
      className={`photo ${hasImage ? 'has-image' : tone} ${className}`}
      style={style}
    >
      {hasImage ? <img src={image} alt="" /> : null}
      {children}
    </div>
  );
}
