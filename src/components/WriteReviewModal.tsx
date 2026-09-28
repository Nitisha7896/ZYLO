import React, { useState } from 'react';
import { X, Star, Upload, Check } from 'lucide-react';
import { Product, Review } from '../types';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSubmitReview: (productId: string, review: Review) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [fit, setFit] = useState<'Runs Small' | 'True to Size' | 'Runs Large'>('True to Size');
  const [qualityScore, setQualityScore] = useState(5);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: author.trim(),
      location: location.trim() || 'Verified Client',
      rating,
      date: 'Just now',
      verified: true,
      title: title.trim(),
      content: content.trim(),
      fit,
      qualityScore,
      helpfulCount: 0,
      photos: hasPhoto ? [product.images[0]] : undefined,
    };

    onSubmitReview(product.id, newReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAF9F6] w-full max-w-lg shadow-2xl z-10 border border-[#E8E6DF] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label="Close review dialog"
          className="absolute top-5 right-5 text-stone-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <Check size={24} />
            </div>
            <h3 className="font-serif text-2xl text-stone-900">Review Published</h3>
            <p className="text-xs text-stone-600">
              Thank you for sharing your sartorial experience with the Atelier Véra community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                Client Review
              </span>
              <h3 className="font-serif text-2xl text-stone-900 mt-0.5">{product.name}</h3>
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stone-700 font-medium block">
                Overall Impression
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-stone-800 hover:scale-110 transition-transform"
                  >
                    <Star
                      size={22}
                      className={
                        (hoverRating || rating) >= star
                          ? 'fill-[#141414] text-[#141414]'
                          : 'stroke-stone-300 text-stone-300'
                      }
                    />
                  </button>
                ))}
                <span className="text-xs font-mono text-stone-600 ml-2">
                  {rating === 5 ? 'Exceptional' : rating === 4 ? 'Very Good' : `${rating} Stars`}
                </span>
              </div>
            </div>

            {/* Fit Feedback Selector */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-stone-700 font-medium block">
                Sizing & Proportion
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Runs Small', 'True to Size', 'Runs Large'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFit(opt)}
                    className={`py-2 text-xs font-medium uppercase tracking-wider border transition-colors ${
                      fit === opt
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-700 font-medium block mb-1">
                Headline / Summary
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Exquisite leather temper and drape"
                className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            {/* Review Commentary */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone-700 font-medium block mb-1">
                Detailed Review
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on the material, tactile feel, weight, craftsmanship, and styling versatility..."
                className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900 resize-none"
              />
            </div>

            {/* Reviewer Name & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-stone-700 font-medium block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g., Diane B."
                  className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-stone-700 font-medium block mb-1">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Paris, France"
                  className="w-full bg-white border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* Photo Attachment Simulation */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`w-full py-2.5 px-3 border border-dashed text-xs flex items-center justify-center gap-2 transition-colors ${
                  hasPhoto
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-stone-300 text-stone-600 hover:border-stone-400'
                }`}
              >
                <Upload size={14} />
                <span>{hasPhoto ? 'Photo Attached (1 Styled Image)' : 'Attach Styled Photo (Optional)'}</span>
              </button>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#141414] text-white hover:bg-black text-xs uppercase tracking-[0.12em] font-medium transition-colors shadow-xs"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
