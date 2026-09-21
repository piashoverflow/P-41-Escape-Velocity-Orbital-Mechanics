import React from 'react';
import { MathView } from './MathView';
import { P41Mode } from '../types';
import { BookOpen, X } from 'lucide-react';

interface MathFormulaOverlayProps {
  mode: P41Mode;
  show: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export const MathFormulaOverlay: React.FC<MathFormulaOverlayProps> = ({
  mode,
  show,
  onClose,
  lang,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-white">
            {lang === 'bn' ? 'P-41 মুক্তিবেগ ও কক্ষীয় বলবিদ্যার গাণিতিক প্রমাণ' : 'P-41 Escape Velocity & Orbital Mechanics Proofs'}
          </h2>
        </div>

        <div className="space-y-6 text-sm">
          {/* Escape Velocity Derivation */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-amber-400 font-bold text-base">
              {lang === 'bn' ? '১. মুক্তিবেগের গাণিতিক প্রতিপাদন (Escape Velocity)' : '1. Escape Velocity Derivation'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'যান্ত্রিক শক্তি সংরক্ষণশীলতার নীতি অনুসারে, অসীম দূরত্বে পৌঁছাতে বস্তুটির প্রাথমিক মোট শক্তি শূন্য হতে হবে:'
                : 'By conservation of mechanical energy, for a particle to reach infinity with zero excess kinetic energy:'}
            </p>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-amber-300">
              <MathView math="E_i = \frac{1}{2}m v_e^2 - \frac{GMm}{R} = 0 \implies v_e = \sqrt{\frac{2GM}{R}} = \sqrt{2gR}" block />
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'bn'
                ? 'পৃথিবীর জন্য: g = ৯.৮১ m/s² এবং R = ৬.৩৭ × ১০⁶ m বসিয়ে পাই: v_e ≈ ১১.২ km/s।'
                : 'For Earth: substituting g = 9.81 m/s² and R = 6.371 × 10⁶ m yields v_e ≈ 11.2 km/s.'}
            </p>
          </div>

          {/* Relation to Orbital speed */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-cyan-400 font-bold text-base">
              {lang === 'bn' ? '২. মুক্তিবেগ ও বৃত্তীয় কক্ষীয় বেগের সম্পর্ক' : '2. Escape Velocity vs. Circular Orbital Speed'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'প্রথম মহাজাগতিক বেগ (বৃত্তীয়)' : 'Circular Orbital Velocity (v_0)'}</div>
                <MathView math="v_0 = \sqrt{gR} \approx 7.91\text{ km/s}" block />
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-center">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'দ্বিতীয় মহাজাগতিক বেগ (মুক্তিবেগ)' : 'Escape Velocity (v_e)'}</div>
                <MathView math="v_e = \sqrt{2} \cdot v_0 \approx 1.414 v_0" block />
              </div>
            </div>
            <p className="text-xs text-cyan-300">
              {lang === 'bn'
                ? '💡 অর্থাৎ বৃত্তাকার কক্ষপথের বেগকে মাত্র ৪১.৪% বৃদ্ধি করলেই উপগ্রহটি মুক্তিবেগ পেয়ে পালিয়ে যায়!'
                : '💡 Increasing circular orbital speed by just 41.4% (factor of √2) achieves escape trajectory!'}
            </p>
          </div>

          {/* Atmosphere retention */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-emerald-400 font-bold text-base">
              {lang === 'bn' ? '৩. চাঁদে কেন বায়ুমণ্ডল নেই? (ম্যাক্সওয়েল বেগ বণ্টন)' : '3. Why Does the Moon Have No Atmosphere?'}
            </h3>
            <p className="text-slate-300">
              {lang === 'bn'
                ? 'গ্যাস অণুর বর্গমূলীয় গড় বর্গবেগ (Root Mean Square Speed):'
                : 'Gas molecule root-mean-square thermal speed:'}
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg text-center font-mono text-emerald-300">
              <MathView math="v_{\text{rms}} = \sqrt{\frac{3RT}{M}}" block />
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'bn'
                ? 'কোনো গ্রহ বায়ুমণ্ডল ধরে রাখতে পারবে যদি v_{\text{rms}} < \frac{1}{6} v_e হয়। চাঁদের মুক্তিবেগ (২.৩৮ km/s) খুব কম হওয়ায় দিনের বেলায় তাপমাত্রা বৃদ্ধির সাথে সাথে সব গ্যাস অণু মহাকাশে বিলীন হয়ে যায়।'
                : "Atmospheric gases escape over astronomical timescales unless v_rms < (1/6) v_e. The Moon's low escape velocity (2.38 km/s) allowed its primordial atmosphere to dissipate."}
            </p>
          </div>

          {/* Kepler Newton Link */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="text-purple-400 font-bold text-base">
              {lang === 'bn' ? '৪. নিউটনের সূত্র থেকে কেপলারের ৩য় সূত্রের প্রমাণ' : "4. Kepler's 3rd Law Derived from Newton's Gravity"}
            </h3>
            <div className="p-3 bg-slate-900 rounded-lg text-center font-mono text-purple-300">
              <MathView math="\frac{mv^2}{r} = \frac{GMm}{r^2} \implies v^2 = \frac{GM}{r} \implies \left(\frac{2\pi r}{T}\right)^2 = \frac{GM}{r}" block />
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg text-center font-mono text-cyan-400">
              <MathView math="T^2 = \left(\frac{4\pi^2}{GM}\right) r^3 \implies T^2 \propto r^3" block />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
