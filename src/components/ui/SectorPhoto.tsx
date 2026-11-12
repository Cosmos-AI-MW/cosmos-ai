"use client";

import Image from "next/image";
import { useState } from "react";

export default function SectorPhoto({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="bg-cosmos-forest relative aspect-[4/3] overflow-hidden">
      {failed ? (
        <div className="text-cosmos-teal absolute inset-0 flex items-center justify-center text-4xl">
          ✴
        </div>
      ) : (
        <>
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
          <div className="bg-cosmos-forest/25 pointer-events-none absolute inset-0 mix-blend-multiply" />
        </>
      )}
    </div>
  );
}
