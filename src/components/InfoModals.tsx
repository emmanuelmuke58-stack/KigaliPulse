import React from 'react';
import { X, MapPin, Mail, Phone, ShieldCheck, Globe, Sparkles } from 'lucide-react';

interface InfoModalProps {
  type: 'about' | 'contact' | 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-0 sm:p-6"
    >
      <div className="relative bg-white sm:rounded-3xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[85vh] overflow-y-auto shadow-2xl border-t sm:border border-slate-200 p-6 sm:p-8 space-y-6 text-slate-800 animate-in fade-in slide-in-from-bottom sm:zoom-in-95 duration-300 pt-[calc(1rem+env(safe-area-inset-top))] sm:pt-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="fixed sm:absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ABOUT KIGALIPULSE */}
        {type === 'about' && (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-base font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Vision</span>
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              About KigaliPulse
            </h2>
            <p className="text-base sm:text-base text-slate-600 leading-relaxed">
              KigaliPulse was built with one urgent premise: answering <em>"What is happening in Kigali?"</em> in three seconds or less.
            </p>
            <p className="text-base sm:text-base text-slate-600 leading-relaxed">
              Whether you are a Kigali native looking for weekend live music at Inema, an international tech founder attending a summit at the Convention Centre, or a family exploring the farmers markets in Gikondo, KigaliPulse provides a modern, verified, mobile-first index of the capital.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border space-y-2 text-base">
              <h4 className="font-bold text-slate-900">Expansion Roadmap: Kigali → Rwanda → East Africa</h4>
              <p className="text-slate-600 leading-relaxed">
                The architecture of KigaliPulse is crafted to seamlessly scale from Kigali’s urban hills to Musanze, Rubavu, Huye, and cross-border EAC hubs without rewriting interface ergonomics.
              </p>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {type === 'contact' && (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              Contact KigaliPulse Office
            </h2>
            <p className="text-base sm:text-base text-slate-600">
              Have inquiries regarding partnerships, event moderation, press, or ticketing integrations?
            </p>

            <div className="space-y-3 pt-2 text-base">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Physical Headquarters</strong>
                  <span className="text-slate-600">Kigali Heights, 4th Floor West Wing, KG 7 Ave, Kimihurura, Kigali, Rwanda</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Email Inquiries</strong>
                  <span className="text-slate-600">editorial@kigalipulse.rw · ads@kigalipulse.rw</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-bold">Phone &amp; WhatsApp Desk</strong>
                  <span className="text-slate-600">+250 788 000 000 (Mon–Fri, 08:30 – 18:00 CAT)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TERMS & CONDITIONS */}
        {type === 'terms' && (
          <div className="space-y-4 text-base text-slate-600 leading-relaxed">
            <h2 className="font-display text-2xl font-extrabold text-slate-900">Terms &amp; Conditions</h2>
            <p>
              Welcome to KigaliPulse. By browsing or submitting events to our platform, you agree to comply with Rwandan commercial guidelines, copyright standards, and the following rules:
            </p>
            <h4 className="font-bold text-slate-900">1. External Ticketing Disclaimer</h4>
            <p>
              KigaliPulse serves as an authoritative discovery platform and does not directly process payments or issue admission tickets. All transactions take place on verified external ticketing providers (e.g., Mookh, Eventbrite, TiCQ, venue box offices). KigaliPulse is not liable for ticketing refunds or event cancellations.
            </p>
            <h4 className="font-bold text-slate-900">2. Organizer Moderation &amp; Verification</h4>
            <p>
              All event listings submitted by third-party organizers are subject to administrative moderation. Fabricated dates, unlicensed venues, or prohibited promotions will be immediately rejected or removed.
            </p>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {type === 'privacy' && (
          <div className="space-y-4 text-base text-slate-600 leading-relaxed">
            <h2 className="font-display text-2xl font-extrabold text-slate-900">Privacy Policy</h2>
            <p>
              KigaliPulse respects your privacy and adheres to Law No. 058/2021 relating to the protection of personal data and privacy in the Republic of Rwanda.
            </p>
            <h4 className="font-bold text-slate-900">Data We Collect</h4>
            <p>
              We collect information you voluntarily provide such as name, contact email, and saved event preferences. We do not sell your personal information to third parties.
            </p>
            <h4 className="font-bold text-slate-900">Analytics &amp; Cookies</h4>
            <p>
              Aggregated, anonymized statistics are gathered to measure platform performance, event view metrics, and regional discovery trends.
            </p>
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-base font-bold hover:bg-slate-800 transition-colors"
          >
            Acknowledge &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};
