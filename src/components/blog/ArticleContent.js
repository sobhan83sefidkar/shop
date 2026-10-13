import { slugify } from '@/lib/seo';

// رندر بلوک‌های محتوای مقاله. هر heading یه id میگیره تا فهرست
// مطالب بتونه بهش لینک بده (اسکرول نرم از globals.css فعاله).
export default function ArticleContent({ blocks = [] }) {
  return (
    <div className="prose-content space-y-5">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          const id = slugify(block.text) || `section-${i}`;
          const Tag = `h${Math.min(Math.max(block.level || 2, 2), 4)}`;
          return (
            <Tag key={i} id={id} className="text-ink font-bold text-xl scroll-mt-24 pt-2">
              {block.text}
            </Tag>
          );
        }
        return (
          <p key={i} className="text-ash leading-8 text-[15px]">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

/** استخراج فهرست مطالب (فقط heading ها) برای نمایش در سایدبار */
export function extractHeadings(blocks = []) {
  return blocks
    .filter(b => b.type === 'heading')
    .map((b, i) => ({ id: slugify(b.text) || `section-${i}`, text: b.text }));
}
