import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: 'clothing' | 'bags' | 'accessories';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, category }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isOpen) return null;

  const clothingSizes = [
    { size: 'XS', fr: '34', us: '2', bustCm: '82-85', bustIn: '32-33.5', waistCm: '62-65', waistIn: '24.5-25.5', hipCm: '88-91', hipIn: '34.5-36' },
    { size: 'S', fr: '36', us: '4', bustCm: '86-89', bustIn: '34-35', waistCm: '66-69', waistIn: '26-27', hipCm: '92-95', hipIn: '36-37.5' },
    { size: 'M', fr: '38', us: '6', bustCm: '90-93', bustIn: '35.5-36.5', waistCm: '70-73', waistIn: '27.5-28.5', hipCm: '96-99', hipIn: '38-39' },
    { size: 'L', fr: '40', us: '8', bustCm: '94-98', bustIn: '37-38.5', waistCm: '74-78', waistIn: '29-30.5', hipCm: '100-104', hipIn: '39.5-41' },
    { size: 'XL', fr: '42', us: '10', bustCm: '99-104', bustIn: '39-41', waistCm: '79-84', waistIn: '31-33', hipCm: '105-110', hipIn: '41.5-43' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative bg-[#FAF9F6] w-full max-w-2xl shadow-2xl z-10 border border-[#E8E6DF] p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute top-5 right-5 text-stone-400 hover:text-black transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-stone-900 mb-1">
          <Ruler size={18} />
          <h2 className="font-serif text-2xl font-normal">Sartorial Sizing Guide</h2>
        </div>
        <p className="text-xs text-stone-500 uppercase tracking-wider mb-6">
          French Couture Standards & Dimensions
        </p>

        {/* Unit toggle */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-stone-600 font-medium">Measurement System:</span>
          <div className="inline-flex border border-stone-300 bg-white">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-mono uppercase ${
                unit === 'cm' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
              }`}
            >
              Centimeters (CM)
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs font-mono uppercase ${
                unit === 'in' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
              }`}
            >
              Inches (IN)
            </button>
          </div>
        </div>

        {/* Sizing Table */}
        <div className="overflow-x-auto border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0ECE1] text-stone-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">FR</th>
                <th className="py-2.5 px-3">US</th>
                <th className="py-2.5 px-3">Bust ({unit})</th>
                <th className="py-2.5 px-3">Waist ({unit})</th>
                <th className="py-2.5 px-3">Hips ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 font-mono text-stone-700 bg-white">
              {clothingSizes.map((row) => (
                <tr key={row.size} className="hover:bg-stone-50">
                  <td className="py-2.5 px-3 font-semibold text-stone-900">{row.size}</td>
                  <td className="py-2.5 px-3">{row.fr}</td>
                  <td className="py-2.5 px-3">{row.us}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? row.bustCm : row.bustIn}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                  <td className="py-2.5 px-3">{unit === 'cm' ? row.hipCm : row.hipIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measuring tips */}
        <div className="mt-6 p-4 bg-[#F5F3EC] border border-stone-200 text-xs text-stone-600 space-y-1.5 font-light">
          <div className="font-semibold uppercase tracking-wider text-stone-900">How to Measure:</div>
          <div><strong>Bust:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</div>
          <div><strong>Waist:</strong> Measure around the narrowest natural point above your hip bone.</div>
          <div><strong>Hips:</strong> Measure around the fullest part of your hips with feet together.</div>
          <div className="pt-1 text-stone-500 italic">
            Need bespoke advice? Our concierge team offers virtual fit consultations.
          </div>
        </div>
      </div>
    </div>
  );
};
