import React, { useMemo, useState } from "react";
import { imageCandidates } from "../config";

const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect fill='#efe7db' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#7a6e62' font-family='Poppins,sans-serif' font-size='22'>HSM Furniture</text></svg>"
  );

export default function ProductImage({ image, images, alt, className }) {
  const candidates = useMemo(
    () => imageCandidates(images?.length ? images : image),
    [image, images]
  );
  const [index, setIndex] = useState(0);
  const src = candidates[index] || PLACEHOLDER;

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}
