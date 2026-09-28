import React, { useState } from 'react';
import { Star, ThumbsUp, ShieldCheck, PenLine } from 'lucide-react';
import { Product, Review } from '../types';

interface ReviewsSectionProps {
  product: Product;
  onOpenWriteReview: () => void;
  onVoteHelpful: (productId: string, reviewId: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  product,
  onOpenWriteReview,
  onVoteHelpful,
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Distribution calculations
  const totalReviews = product.reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((r) => r.rating === star).length,
    percentage:
      totalReviews > 0
        ? Math.round((product.reviews.filter((r) => r.rating === star).length / totalReviews) * 100)
        : 0,
  }));

  // Fit stats
  const trueToSizeCount = product.reviews.filter((r) => r.fit === 'True to Size').length;
  const runsSmallCount = product.reviews.filter((r) => r.fit === 'Runs Small').length;
  const runsLargeCount = product.reviews.filter((r) => r.fit === 'Runs Large').length;
  const fitPercentage = totalReviews > 0 ? Math.round((trueToSizeCount / totalReviews) * 100) : 100;

  // Filtered reviews
  const displayedReviews = product.reviews.filter((r) => {
    if (filterRating !== 'all' && r.rating !== filterRating) return false;
    if (verifiedOnly && !r.verified) return false;
    return true;
  });

  return (
    <div className="space-y-8 pt-4">
      {/* Top Aggregate Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#F5F3EC] p-6 border border-[#E5E2D9]">
        {/* Overall Score */}
        <div className="md:col-span-4 flex flex-col justify-center items-center md:items-start border-b md:border-b-0 md:border-r border-stone-300 pb-4 md:pb-0 md:pr-6">
          <span className="font-serif text-5xl font-normal text-stone-900 leading-none">
            {product.rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= Math.round(product.rating)
                    ? 'fill-stone-900 text-stone-900'
                    : 'text-stone-300'
                }
              />
            ))}
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Based on {product.reviewCount} verified client reviews
          </p>
          <button
            onClick={onOpenWriteReview}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-wider font-medium transition-colors"
          >
            <PenLine size={13} />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-5 flex flex-col justify-center space-y-1.5">
          {ratingCounts.map(({ star, count, percentage }) => (
            <button
              key={star}
              onClick={() => setFilterRating(filterRating === star ? 'all' : star)}
              className="flex items-center gap-2 text-xs group text-left w-full hover:opacity-90"
            >
              <span className="w-10 font-mono text-stone-600">{star} stars</span>
              <div className="flex-1 h-2 bg-stone-300/80 overflow-hidden rounded-full">
                <div
                  className="h-full bg-stone-900 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right font-mono text-stone-500">{percentage}%</span>
            </button>
          ))}
        </div>

        {/* Sizing & Proportion Feedback */}
        <div className="md:col-span-3 flex flex-col justify-center border-t md:border-t-0 md:border-l border-stone-300 pt-4 md:pt-0 md:pl-6 space-y-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-900">
            Fit Consensus
          </span>
          <div className="font-serif text-2xl text-stone-900">{fitPercentage}%</div>
          <p className="text-xs text-stone-600">
            Clients report this piece is <strong className="font-semibold text-black">True to Size</strong>.
          </p>
          <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
            <div>Runs small: {runsSmallCount} votes</div>
            <div>True to size: {trueToSizeCount} votes</div>
            <div>Runs large: {runsLargeCount} votes</div>
          </div>
        </div>
      </div>

      {/* Review Filters & Count */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-stone-500 uppercase tracking-wider">Filter:</span>
          <button
            onClick={() => setFilterRating('all')}
            className={`px-2.5 py-1 ${
              filterRating === 'all' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-black'
            }`}
          >
            All Ratings
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-2.5 py-1 ${
              filterRating === 5 ? 'bg-stone-900 text-white font-medium' : 'text-stone-600 hover:text-black'
            }`}
          >
            5 Stars Only
          </button>
          <label className="flex items-center gap-1.5 cursor-pointer ml-2 text-stone-700">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-stone-900"
            />
            <span>Verified Purchasers</span>
          </label>
        </div>

        <span className="font-serif italic text-stone-500">
          Showing {displayedReviews.length} reviews
        </span>
      </div>

      {/* Reviews Feed List */}
      <div className="space-y-6 divide-y divide-stone-200/80">
        {displayedReviews.length === 0 ? (
          <div className="text-center py-8 text-stone-500 text-xs">
            No client reviews match this filter.
          </div>
        ) : (
          displayedReviews.map((review) => (
            <div key={review.id} className="pt-6 first:pt-0 space-y-3">
              {/* Header: Stars, Verified tag, Author, Date */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        className={
                          star <= review.rating
                            ? 'fill-stone-900 text-stone-900'
                            : 'text-stone-300'
                        }
                      />
                    ))}
                  </div>
                  <span className="font-medium text-xs text-stone-900">{review.title}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                  <span>{review.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{review.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{review.date}</span>
                </div>
              </div>

              {/* Verified Purchase & Fit Indicator */}
              <div className="flex items-center gap-3 text-[11px] text-stone-500">
                {review.verified && (
                  <span className="flex items-center gap-1 text-emerald-800 font-medium">
                    <ShieldCheck size={13} />
                    <span>Verified Atelier Client</span>
                  </span>
                )}
                <span aria-hidden="true">·</span>
                <span>Fit: <strong className="text-stone-800 font-medium">{review.fit}</strong></span>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                {review.content}
              </p>

              {/* Optional Photo Thumbnail */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {review.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Client styled photo"
                      className="w-16 h-20 object-cover border border-stone-300"
                    />
                  ))}
                </div>
              )}

              {/* Helpful Vote Button */}
              <div className="pt-1 flex items-center justify-between text-xs text-stone-500">
                <button
                  onClick={() => onVoteHelpful(product.id, review.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 border transition-colors ${
                    review.userHelpfulVoted
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 text-stone-600 hover:border-black'
                  }`}
                >
                  <ThumbsUp size={12} />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>

                <span className="text-[11px] text-stone-400">Atelier Client Experience</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
