import React from 'react';
import { Language } from '../types';
import { t } from '../utils/i18n';
import { X, BookOpen, GraduationCap, Rocket, Wind, Orbit } from 'lucide-react';

interface TheoryModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryModal: React.FC<TheoryModalProps> = ({
  language,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 text-slate-900">
            <div className="p-2 bg-cyan-50 text-cyan-700 rounded-xl border border-cyan-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {language === 'bn' ? 'তত্ত্ব ও একাডেমিক প্রমাণ (P-41)' : 'Theory & Derivations (P-41)'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                HSC Physics 1st Paper, Chapter 6: মুক্তিবেগ, নিউটনের মহাকাশীয় কামান ও বায়ুমণ্ডলীয় স্থায়িত্ব
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Section 1: Escape Velocity */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
              ১. মুক্তিবেগের তাত্ত্বিক প্রতিপাদন (Escape Velocity Derivation)
            </h3>
            <p>
              সর্বনিম্ন যে আদিবেগে কোনো বস্তুকে কোনো গ্রহের পৃষ্ঠ হতে মহাশূন্যে নিক্ষেপ করলে তা গ্রহের মহাকর্ষীয় আকর্ষণ ক্ষেত্র চিরতরে অতিক্রম করে আর কখনো ফিরে আসে না, তাকে ঐ গ্রহের <strong>মুক্তিবেগ (v_e)</strong> বলে।
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center text-xs font-bold text-slate-900 space-y-1">
              <p>যান্ত্রিক শক্তির সংরক্ষণশীলতা নীতি অনুসারে:</p>
              <p>E_initial = ½ m v_e² + (- GMm / R) = E_final = 0 (অসীমে)</p>
              <p className="text-cyan-800 text-sm pt-1">v_e = √(2GM / R) = √(2gR) = R √(8/3 π G ρ)</p>
            </div>
            <p className="text-xs text-slate-600">
              পৃথিবীর ক্ষেত্রে: R = 6.4 × 10⁶ m, g = 9.8 m/s² বসিয়ে পাই <strong>v_e = √(2 × 9.8 × 6.4 × 10⁶) ≈ 11.2 km/s</strong> (বা 25,000 mph)।
            </p>
          </div>

          {/* Section 2: Newton's Cannon & Conics */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              ২. নিউটনের কামানের চিন্তা পরীক্ষা ও কনিক গতিপথ (Newton's Cannonball)
            </h3>
            <p>
              স্যার আইজ্যাক নিউটন ১৬৮৭ সালে তাঁর <em>Principia</em> গ্রন্থে একটি উচ্চ পর্বতের চূড়া থেকে আনুভূমিকভাবে নিক্ষিপ্ত কামানের গোলার মাধ্যমে কক্ষীয় গতির ব্যাখ্যা প্রদান করেন:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                <strong className="text-indigo-950 font-bold block">★ বৃত্তাকার ও উপবৃত্তাকার আবদ্ধ কক্ষপথ (E &lt; 0):</strong>
                <p className="font-mono text-indigo-800">• v = v_c = √(gR) ≈ 7.91 km/s ➔ বৃত্তাকার (e = 0)</p>
                <p className="font-mono text-indigo-800">• 7.91 &lt; v &lt; 11.2 km/s ➔ উপবৃত্তাকার (0 &lt; e &lt; 1)</p>
              </div>
              <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 space-y-1">
                <strong className="text-cyan-950 font-bold block">★ উন্মুক্ত মহাকাশ মুক্তিপথ (E ≥ 0):</strong>
                <p className="font-mono text-cyan-800">• v = v_e = √(2gR) ≈ 11.2 km/s ➔ পরাবৃত্তাকার (e = 1, E = 0)</p>
                <p className="font-mono text-cyan-800">• v &gt; 11.2 km/s ➔ অধিবৃত্তাকার (e &gt; 1, E &gt; 0)</p>
              </div>
            </div>
          </div>

          {/* Section 3: Kinetic Theory & Atmospheric Retention */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              ৩. বায়ুমণ্ডলের গ্যাস ধারণ ও জিন্স এসকেপ (Jeans Escape)
            </h3>
            <p>
              গ্যাসের গতিতত্ত্ব অনুযায়ী T পরম তাপমাত্রায় M মোলার ভরের গ্যাসের অণুসমূহের গড় বর্গবেগের বর্গমূল (RMS বেগ):
            </p>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl font-mono text-center text-xs font-bold text-amber-950 space-y-1">
              <p>v_rms = √(3RT / M)</p>
              <p className="text-xs font-sans text-slate-700">জিন্স এসকেপ শর্ত: যদি <strong>v_rms &gt; ⅙ v_e</strong> হয়, তবে ম্যাক্সওয়েল টেইল ডিস্ট্রিবিউশনের শীর্ষ অণুগুলো মহাকর্ষ অতিক্রম করে মহাশূন্যে উবে যায়।</p>
            </div>
            <p className="text-xs text-slate-600">
              <strong>চাঁদে কেন বায়ুমণ্ডল নেই?</strong> চাঁদের পৃষ্ঠে মুক্তিবেগ মাত্র 2.38 km/s। চাঁদের দিবাভাগের উচ্চ তাপমাত্রায় (≈ 380 K) প্রায় সব গ্যাসের v_rms এই মুক্তিবেগের কাছাকাছি হওয়ায় কোনো গ্যাসই চাঁদে টিকতে পারেনি। বিপরীতে বৃহস্পতির মুক্তিবেগ 59.5 km/s হওয়ায় সেখানে অতি হালকা হাইড্রোজেন ও হিলিয়ামও অক্ষত রয়ে গেছে।
            </p>
          </div>

          {/* Section 4: Newton-Kepler Bridge */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              ৪. নিউটনের সূত্র থেকে কেপলারের ৩য় সূত্র প্রতিপাদন
            </h3>
            <p>
              r ব্যাসার্ধের বৃত্তাকার কক্ষপথে m ভরের উপগ্রহের ওপর পৃথিবীর মহাকর্ষ বলই প্রয়োজনীয় কেন্দ্রমুখী বল যোগায়:
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-center text-xs font-bold text-emerald-950 space-y-1">
              <p>F_g = F_c &nbsp;➔&nbsp; GMm / r² = m v² / r &nbsp;➔&nbsp; v = √(GM / r)</p>
              <p>যেহেতু v = 2πr / T, অতএব 4π²r² / T² = GM / r</p>
              <p className="text-sm text-emerald-800">➔ T² = (4π² / GM) · r³ &nbsp;(T² ∝ r³ প্রমাণিত)</p>
            </div>
          </div>

          {/* Section 5: Udvash Admission Tips */}
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>উদ্ভাস ভর্তি পরীক্ষা স্পেশাল টিপস (BUET / Medical / DU Admission)</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              <li>
                <strong>কোণের ফাঁদ:</strong> মুক্তিবেগ নিক্ষেপণ কোণের (θ) ওপর নির্ভর করে না! খাড়া উপরের দিকে (90°), 45° কোণে কিংবা আনুভূমিকভাবে (0°) নিক্ষেপ করলেও মুক্তিবেগ সর্বদা 11.2 km/s থাকবে (বায়ুর ঘর্ষণ উপেক্ষা করে)।
              </li>
              <li>
                <strong>ভরের ফাঁদ:</strong> মুক্তিবেগ নিক্ষিপ্ত বস্তুর ভরের (m) ওপর নির্ভর করে না। একটি 1 গ্রাম সুই কিংবা 10,000 কেজি রকেটের মুক্তিবেগ একই।
              </li>
              <li>
                <strong>কক্ষীয় দ্রুতি ও মুক্তিবেগের সম্পর্ক:</strong> v_e = √2 · v_c ≈ 1.414 v_c। অর্থাৎ কক্ষপথে চলমান কৃত্রিম উপগ্রহের বেগ 41.4% বৃদ্ধি পেলেই তা মুক্তিবেগ লাভ করে মহাশূন্যে ছিটকে যাবে!
              </li>
              <li>
                <strong>ঘনত্ব ও ব্যাসার্ধ ভিত্তিক সূত্র:</strong> v_e = R √(8/3 π G ρ)। যদি কোনো গ্রহের গড় ঘনত্ব পৃথিবীর সমান কিন্তু ব্যাসার্ধ দ্বিগুণ হয়, তবে তার মুক্তিবেগও দ্বিগুণ (22.4 km/s) হবে!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
