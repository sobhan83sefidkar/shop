'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatDateShort } from '@/lib/format';
import StarRating from '@/components/common/StarRating';

export default function ReviewsSection({
  productId,
  initialReviews = [],
}) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // ============================================================
  // ثبت نظر
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // پاک کردن خطای قبلی
    setError('');

    // بررسی لاگین
    if (!user) {
      setError('برای ثبت نظر ابتدا وارد حساب کاربری شوید.');
      return;
    }

    // بررسی متن
    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      setError('لطفاً متن نظر را وارد کنید.');
      return;
    }

    if (trimmedComment.length < 10) {
      setError('حداقل ۱۰ کاراکتر بنویسید.');
      return;
    }

    // بررسی امتیاز
    if (rating < 1 || rating > 5) {
      setError('لطفاً یک امتیاز بین ۱ تا ۵ انتخاب کنید.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.submitProductReview(productId, {
        name: user.name,
        rating: rating,
        text: trimmedComment,
      });

      console.log('Review submitted:', response);

      // چون نظر pending است، فعلاً به لیست نظرات اضافه نمی‌کنیم
      // تا قبل از تایید ادمین در سایت نمایش داده نشود.

      setSubmitted(true);
      setShowForm(false);

      setComment('');
      setRating(5);
    } catch (err) {
      console.error('Submit review error:', err);

      setError(
        err?.message ||
        'خطایی هنگام ثبت نظر رخ داد. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // نمایش
  // ============================================================

  return (
    <div className="bg-panel border border-line rounded-card p-5 md:p-6">

      {/* ========================================================
          Header
      ======================================================== */}

      <div className="flex items-center justify-between mb-4">

        <h2 className="font-bold text-ink text-lg">
          نظرات خریداران (
          {reviews.length.toLocaleString('fa-IR')}
          )
        </h2>

        {user ? (
          !submitted && (
            <button
              type="button"
              onClick={() => {
                setShowForm((prev) => !prev);
                setError('');
              }}
              className="text-sm text-grape-light hover:underline"
            >
              {showForm ? 'بستن' : '+ ثبت نظر'}
            </button>
          )
        ) : (
          <Link
            href="/login"
            className="text-sm text-grape-light hover:underline"
          >
            برای ثبت نظر وارد شوید
          </Link>
        )}

      </div>

      {/* ========================================================
          پیام موفقیت
      ======================================================== */}

      {submitted && (
        <div className="bg-leaf/10 text-leaf text-sm px-4 py-3 rounded-btn mb-4">
          نظر شما با موفقیت ثبت شد و پس از تأیید ادمین
          در سایت نمایش داده می‌شود. ممنون از بازخوردتون 🙏
        </div>
      )}

      {/* ========================================================
          فرم ثبت نظر
      ======================================================== */}

      {showForm && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-btn p-4 mb-5 space-y-4"
        >

          {/* Error */}

          {error && (
            <div className="bg-ember/10 text-ember text-xs px-3 py-2 rounded-btn">
              {error}
            </div>
          )}

          {/* Rating */}

          <div>
            <p className="text-xs text-ash mb-2">
              امتیاز شما
            </p>

            <div
              className="flex gap-1"
              dir="ltr"
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRating(r)}
                  disabled={submitting}
                  aria-label={`امتیاز ${r} از 5`}
                  className={`
                    text-2xl
                    transition
                    hover:scale-110
                    disabled:opacity-50
                    ${r <= rating
                      ? 'text-amber'
                      : 'text-line'
                    }
                  `}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}

          <div>
            <p className="text-xs text-ash mb-2">
              متن نظر
            </p>

            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);

                if (error) {
                  setError('');
                }
              }}
              required
              minLength={10}
              rows={4}
              disabled={submitting}
              placeholder="تجربه‌ی استفاده‌تون از این محصول رو بنویسید..."
              className="
                w-full
                bg-night
                border
                border-line
                rounded-btn
                px-3
                py-2
                text-sm
                text-ink
                placeholder:text-ash-dark
                focus:border-grape
                transition
                resize-none
                disabled:opacity-50
              "
            />

            <div className="text-[11px] text-ash-dark mt-1">
              حداقل ۱۰ کاراکتر
            </div>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={submitting}
            className="
              bg-grape
              hover:bg-grape/80
              text-white
              text-sm
              font-bold
              px-5
              py-2
              rounded-btn
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {submitting
              ? 'در حال ارسال...'
              : 'ثبت نظر'}
          </button>

        </form>
      )}

      {/* ========================================================
          Reviews List
      ======================================================== */}

      {reviews.length === 0 ? (

        <p className="text-sm text-ash">
          هنوز نظری برای این محصول ثبت نشده.
          اولین نفر باشید!
        </p>

      ) : (

        <div className="space-y-4">

          {reviews.map((review) => (

            <div
              key={review.id || review._id}
              className="
                border-t
                border-line
                pt-4
                first:border-t-0
                first:pt-0
              "
            >

              {/* User + Date */}

              <div className="flex items-center justify-between mb-1">

                <span className="text-sm text-ink font-bold">
                  {review.name ||
                    review.user?.name ||
                    'کاربر تک‌نبولا'}
                </span>

                {review.createdAt && (
                  <span className="text-xs text-ash-dark">
                    {formatDateShort(review.createdAt)}
                  </span>
                )}

              </div>

              {/* Rating */}

              <StarRating
                rating={review.rating}
              />

              {/* Text */}

              <p className="text-sm text-ash mt-2 leading-6">
                {review.text || review.comment}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}