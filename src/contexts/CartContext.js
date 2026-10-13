'use client';
// ============================================================
// سبد خرید — سمت کلاینت، ذخیره در localStorage
// ------------------------------------------------------------
// سبد خرید سمت سرور نگه‌داری نمیشه (بک‌اند فعلاً چنین چیزی نداره
// و نیازی هم نیست) — فقط موقع «نهایی کردن خرید» توی صفحه‌ی
// چک‌اوت، کل سبد به شکل یه سفارش به POST /api/orders فرستاده
// میشه. این دقیقاً همون الگوی استانداردیه که اکثر فروشگاه‌های
// آنلاین استفاده می‌کنن.
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'technubela_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // خوندن سبد ذخیره‌شده هنگام بارگذاری اولیه (فقط سمت کلاینت)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // اگه داده خراب بود، سبد خالی شروع میشه
    } finally {
      setHydrated(true);
    }
  }, []);

  // ذخیره‌ی خودکار هر تغییر توی سبد
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock ?? 99);
        return prev.map(i => i.productId === product.id ? { ...i, quantity: newQty } : i);
      }
      return [...prev, {
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock ?? 99),
      }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems(prev => prev.map(i => {
      if (i.productId !== productId) return i;
      const clamped = Math.max(1, Math.min(quantity, i.stock ?? 99));
      return { ...i, quantity: clamped };
    }));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, count, hydrated }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart باید داخل CartProvider استفاده بشه');
  return ctx;
}
