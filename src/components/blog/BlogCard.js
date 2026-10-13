import Link from 'next/link';
import { formatDate } from '@/lib/format';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

export default function BlogCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group bg-panel border border-line rounded-card overflow-hidden hover:border-grape/60 transition block">
      <div className="aspect-video bg-card overflow-hidden">
        {post.image ? (
          <img src={`${API_BASE}${post.image}`} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-ash-dark">📰</div>
        )}
      </div>
      <div className="p-4">
        <span className="text-[11px] text-lagoon">{post.category}</span>
        <h3 className="text-ink font-bold text-sm mt-1 line-clamp-2">{post.title}</h3>
        <p className="text-ash text-xs mt-2 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-2 text-[11px] text-ash-dark mt-3">
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readTime?.toLocaleString('fa-IR')} دقیقه مطالعه</span>
        </div>
      </div>
    </Link>
  );
}
