"use client";

import { useState } from "react";
import Image from "next/image";

export function DestinationHeroImage({
  src,
  alt,
  fallbackSrc,
}: {
  src: string;
  alt: string;
  fallbackSrc: string;
}) {
  const [image, setImage] = useState(src || fallbackSrc);

  return (
    <Image
      src={image}
      alt={alt}
      fill
      priority
      sizes="100vw"
      className="object-cover"
      onError={() => setImage(fallbackSrc)}
    />
  );
}
