'use client';

import Link from 'next/link';
import { CATEGORY_GROUPS } from '@/lib/categories';

export default function MegaMenu({ onNavigate }) {
  return (
    <div
      className="
        absolute
        z-50

        top-full

        left-1/2
        -translate-x-1/2

        mt-2

        w-[calc(100vw-2rem)]
        max-w-[950px]
      "
    >
      <div
        className="
          bg-panel
          border
          border-line
          rounded-card
          shadow-2xl

          p-4
          sm:p-5
          lg:p-6

          max-h-[calc(100vh-120px)]
          overflow-y-auto
        "
      >

        <div
          className="
            grid

            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4

            gap-5
            lg:gap-6
          "
        >

          {CATEGORY_GROUPS.map((group) => (
            <div
              key={group.label}
              className="min-w-0"
            >

              {/* عنوان گروه */}
              <h3
                className="
                  text-ink
                  font-bold
                  text-sm
                  mb-3
                "
              >
                {group.label}
              </h3>


              {/* آیتم‌ها */}
              <div className="space-y-2">

                {group.items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/category/${item.slug}`}
                    onClick={onNavigate}
                    className="
                      flex
                      items-center
                      gap-2

                      text-sm
                      text-ash

                      hover:text-ink

                      transition

                      min-w-0
                    "
                  >
                    <span className="shrink-0">
                      {item.icon}
                    </span>

                    <span className="truncate">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
