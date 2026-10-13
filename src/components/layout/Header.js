'use client';

import { useState, useRef, useEffect } from 'react';
import { FaRegUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';

export default function Header() {
  const router = useRouter();

  const { count } = useCart();
  const { user } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const menuRef = useRef(null);

  // بستن MegaMenu با کلیک بیرون
  useEffect(() => {
    function handleClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(search.trim())}`
      );
    }
  };

  return (
    <header className="relative z-50 bg-panel">

      {/* =====================================================
          نوار بالایی
      ====================================================== */}
      <div className="hidden md:block border-b border-line">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-8 flex items-center justify-between text-[11px] text-ash">

            <div>
              پشتیبانی: ۰۲۱-۹۱۰۰۰۰۰۰
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/account/orders"
                className="hover:text-ink transition"
              >
                پیگیری سفارش
              </Link>

              <Link
                href="/blog"
                className="hover:text-ink transition"
              >
                مجله نوبلا
              </Link>
            </div>

          </div>
        </div>
      </div>


      {/* =====================================================
          هدر اصلی
      ====================================================== */}
      <div
        ref={menuRef}
        className="
          relative
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-3
          md:py-4

          flex
          items-center
          gap-3
          md:gap-4
        "
      >

        {/* =================================================
            دکمه منوی موبایل
        ================================================== */}
        <button
          onClick={() => setMobileOpen(true)}
          className="
            lg:hidden
            shrink-0
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-btn
            text-ink
            bg-card
            hover:bg-line
            transition
            text-xl
          "
          aria-label="باز کردن منو"
        >
          ☰
        </button>


        {/* =================================================
            لوگو
        ================================================== */}
        <Link
          href="/"
          className="
            shrink-0
            text-lg
            md:text-xl
            font-bold
            text-ink
          "
        >
          <span className="text-grape-light">نوبلا</span>
        </Link>


        {/* =================================================
            دسته‌بندی‌ها
            فقط دسکتاپ
        ================================================== */}
        <div className="relative hidden lg:block shrink-0">

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={`
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-btn
              text-sm
              font-bold
              whitespace-nowrap
              transition

              ${menuOpen
                ? 'bg-grape text-white'
                : 'bg-card text-ink hover:bg-line'
              }
            `}
          >
            <span>☰</span>
            <span>همه دسته‌بندی‌ها</span>
          </button>

        </div>


        {/* =================================================
            سرچ
            موبایل مخفی
        ================================================== */}
        <form
          onSubmit={handleSearch}
          className="
            hidden
            md:flex
            flex-1
            min-w-0
            max-w-2xl
            relative
          "
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی محصول، برند یا دسته‌بندی..."
            className="
              w-full
              bg-night
              border
              border-line
              rounded-btn
              pr-4
              pl-11
              py-2.5
              text-sm
              text-ink
              placeholder:text-ash-dark
              focus:border-grape
              outline-none
              transition
            "
          />

          <button
            type="submit"
            className="
              absolute
              left-1
              top-1/2
              -translate-y-1/2

              w-9
              h-9

              flex
              items-center
              justify-center

              text-ash
              hover:text-ink
              transition
            "
            aria-label="جستجو"
          >
            🔍
          </button>
        </form>


        {/* =================================================
            آیکون‌های حساب و سبد
        ================================================== */}
        <div
          className="
            flex
            items-center
            gap-1
            md:gap-2
            shrink-0
            mr-auto
          "
        >

          {/* حساب */}
          <Link
            href={user ? '/account' : '/login'}
            className="
              flex
              flex-col
              items-center
              justify-center
              min-w-10
              px-1.5
              md:px-2
              py-1
              text-ash
              hover:text-ink
              transition
            "
          >
            <span className="text-xl">
              <FaRegUserCircle size={25} />
            </span>

            <span className="hidden md:block text-[11px] mt-0.5 whitespace-nowrap">
              {user
                ? user.name?.split(' ')[0] || 'حساب من'
                : 'ورود'}
            </span>
          </Link>


          {/* سبد */}
          <Link
            href="/cart"
            className="
              relative
              flex
              flex-col
              items-center
              justify-center
              min-w-10
              px-1.5
              md:px-2
              py-1
              text-ash
              hover:text-ink
              transition
            "
          >
            <span className="text-xl">
              <IoCartOutline size={25} />
            </span>

            <span className="hidden md:block text-[11px] mt-0.5 whitespace-nowrap">
              سبد خرید
            </span>

            {count > 0 && (
              <span
                className="
                  absolute
                  -top-0.5
                  -left-0.5

                  bg-grape
                  text-white

                  text-[10px]
                  w-5
                  h-5

                  rounded-full

                  flex
                  items-center
                  justify-center

                  font-bold
                "
              >
                {count > 99
                  ? '۹۹+'
                  : count.toLocaleString('fa-IR')}
              </span>
            )}
          </Link>

        </div>


        {/* =================================================
            MegaMenu
            خارج از button
            و روی کل viewport کنترل می‌شود
        ================================================== */}
        {menuOpen && (
          <MegaMenu
            onNavigate={() => setMenuOpen(false)}
          />
        )}

      </div>


      {/* =====================================================
          منوی موبایل
      ====================================================== */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

    </header>
  );
}
