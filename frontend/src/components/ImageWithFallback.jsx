import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ImageWithFallback = ({ src, alt, className = '', style, fallbackText = 'LearnUp' }) => {
  const [hasError, setHasError] = useState(false);

  const getFinalSrc = () => {
    if (!src) return null;
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    if (src.startsWith('/uploads')) return `${API_URL}${src}`;
    return src;
  };

  const finalSrc = getFinalSrc();
  const imageClass = className || 'w-full h-full object-cover';

  if (hasError || !finalSrc) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-800 to-purple-900 w-full h-full ${className}`}
        style={style}
      >
        <ImageIcon size={32} className="text-white/40 mb-2" />
        <span className="text-white/70 font-semibold text-sm tracking-wider uppercase">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={imageClass}
      style={style}
      onError={() => setHasError(true)}
    />
  );
};

export default ImageWithFallback;