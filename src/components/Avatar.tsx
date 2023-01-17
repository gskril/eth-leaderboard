import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface AvatarProps extends ImageProps {
  alt: string;
  src: string;
  fallbackSrc: string;
}

export default function Avatar({
  alt,
  src,
  fallbackSrc,
  ...props
}: AvatarProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      alt={alt}
      src={imgSrc}
      onError={() => setImgSrc(fallbackSrc)}
      {...props}
    />
  );
}
