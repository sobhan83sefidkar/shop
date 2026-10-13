'use client';
import { useState } from 'react';

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const links = [
    { label: 'تلگرام', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { label: 'واتساپ', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { label: 'توییتر/X', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
  ];

  const copyLink = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-ash-dark">اشتراک‌گذاری:</span>
      {links.map(l => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
          className="text-xs bg-card hover:bg-line text-ink px-3 py-1.5 rounded-full transition">
          {l.label}
        </a>
      ))}
      <button onClick={copyLink} className="text-xs bg-card hover:bg-line text-ink px-3 py-1.5 rounded-full transition">
        {copied ? 'کپی شد ✓' : 'کپی لینک'}
      </button>
    </div>
  );
}
