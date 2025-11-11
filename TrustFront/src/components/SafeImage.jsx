// src/components/SafeImage.jsx
import React, { useMemo, useState } from "react";

const loadedSet = new Set();

function normalizeSrc(src, placeholder="/placeholder.png"){
  if(!src) return placeholder;
  if(/^https?:\/\//i.test(src)) return src;
  const clean = src.split("?")[0]; // 캐시버스터 제거
  return `/api${clean.startsWith("/") ? clean : `/${clean}`}`;
}

function SafeImageBase({ src, alt="이미지", width=100, height=100, placeholder="/placeholder.png", eager=false, style }) {
  const [errored, setErrored] = useState(false);
  const normalized = useMemo(()=> normalizeSrc(src, placeholder), [src, placeholder]);
  const alreadyLoaded = loadedSet.has(normalized);
  const [loaded, setLoaded] = useState(alreadyLoaded);

  const final = errored ? placeholder : normalized;

  return (
    <img
      src={final}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onLoad={() => { loadedSet.add(normalized); setLoaded(true); }}
      onError={() => setErrored(true)}
      style={{
        display: "block",
        objectFit: "cover",
        background: "#f3f4f6",
        borderRadius: 8,
        width,
        height,
        // 이미 로드된 src는 바로 표시(깜빡임X)
        opacity: loaded ? 1 : 0,
        transition: loaded ? "none" : "opacity 160ms ease",
        ...style,
      }}
      draggable={false}
      referrerPolicy="no-referrer"
    />
  );
}

export default React.memo(SafeImageBase, (a,b)=> a.src === b.src && a.width===b.width && a.height===b.height);