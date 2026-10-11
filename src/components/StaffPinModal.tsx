import React, { useState } from 'react';
import { X, Lock, KeyRound, CheckCircle2, ArrowRight, ShieldCheck, Delete } from 'lucide-react';
import { useShop, STAFF_PIN } from '../context/ShopContext';

export const StaffPinModal: React.FC = () => {
  const { isPinModalOpen, setIsPinModalOpen, verifyStaffPin, setViewMode } = useShop();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successAnim, setSuccessAnim] = useState(false);

  if (!isPinModalOpen) return null;

  const handleClose = () => {
    setIsPinModalOpen(false);
    setPin('');
    setErrorMsg('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (verifyStaffPin(pin)) {
      setSuccessAnim(true);
      setTimeout(() => {
        setSuccessAnim(false);
        setIsPinModalOpen(false);
        setViewMode('seller');
        setPin('');
      }, 700);
    } else {
      setErrorMsg('Falscher PIN! Alarm ausgelöst: „Der Typ auf dem PC hat versucht reinzukommen!“ (Im Mitarbeiter-Bereich erfasst)');
    }
  };

  const handleNumpadClick = (digit: string) => {
    setErrorMsg('');
    if (pin.length < 12) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setErrorMsg('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleFillDemoPin = () => {
    setPin(STAFF_PIN);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-stone-700" />
            <h2 className="font-serif font-bold text-base text-stone-900">
              Code einlösen / Mitarbeiter-PIN
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-800">
            {successAnim ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 animate-bounce" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-stone-900 text-sm">
              Mitarbeiter-Authentifizierung
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Gib den erforderlichen PIN <strong className="text-stone-800 font-mono">11042014</strong> ein, um den geschützten Händlerbereich freizuschalten.
            </p>
          </div>

          {/* PIN Input Display */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                autoFocus
                value={pin}
                onChange={(e) => {
                  setErrorMsg('');
                  setPin(e.target.value);
                }}
                placeholder="PIN eingeben..."
                className="w-full text-center text-xl font-mono tracking-widest py-3 px-4 rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 outline-none bg-stone-50"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium animate-in shake">
                {errorMsg}
              </p>
            )}

            {/* Quick Helper button */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleFillDemoPin}
                className="text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors"
              >
                PIN 11042014 automatisch einfügen
              </button>
            </div>

            {/* Tactile On-Screen Numpad */}
            <div className="grid grid-cols-3 gap-2 pt-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleNumpadClick(digit)}
                  className="py-2.5 text-base font-semibold font-mono rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 active:scale-95 transition-all"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="py-2.5 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 active:scale-95 transition-all"
              >
                C
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick('0')}
                className="py-2.5 text-base font-semibold font-mono rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-900 active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="py-2.5 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 active:scale-95 transition-all"
                aria-label="Letzte Ziffer löschen"
              >
                <Delete className="w-4 h-4" />
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!pin}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Code einlösen & Freischalten</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
