'use client';
import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

// گالری تصاویر محصول — تصویر اصلی بزرگ + ردیف تامبنیل‌ها.
export default function ProductGallery({ images = [], name }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-square bg-card rounded-card flex items-center justify-center text-6xl text-ash-dark">
        📦
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square bg-card rounded-card overflow-hidden mb-3 border border-line">
        <img
          src={`${API_BASE}${images[active]}`}
          alt={name}
          className="w-full h-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`shrink-0 w-16 h-16 rounded-btn overflow-hidden border-2 transition ${
                i === active ? 'border-grape' : 'border-line opacity-70 hover:opacity-100'
              }`}
            >
              <img src={`${API_BASE}${img}`} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
