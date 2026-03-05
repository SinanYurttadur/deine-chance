import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Heart,
  Users,
  BookOpen,
  Briefcase,
  MessageCircle,
  ChevronRight
} from 'lucide-react';

const Cancel = () => {
  usePageTitle('Mitgliedschaft kündigen');
  const { user, cancelMembership } = useAuth();
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const cancellationReasons = [
    { id: 'found_job', label: 'Ich habe einen Job in der Schweiz gefunden' },
    { id: 'not_moving', label: 'Ich wandere doch nicht aus' },
    { id: 'too_expensive', label: 'Der Beitrag ist mir zu hoch' },
    { id: 'not_using', label: 'Ich nutze die Plattform nicht genug' },
    { id: 'missing_features', label: 'Es fehlen mir wichtige Funktionen' },
    { id: 'other', label: 'Anderer Grund' }
  ];

  const benefits = [
    { icon: BookOpen, title: '13 Wissens-Kapitel', description: 'Komplette Auswanderungs-Anleitung' },
    { icon: Briefcase, title: 'Job-Netzwerk', description: 'Zugang zu Schweizer Stellenangeboten' },
    { icon: Users, title: 'Community', description: 'Austausch mit anderen Auswanderern' },
    { icon: MessageCircle, title: 'Video-Akademie', description: '8 Module Schritt-für-Schritt' }
  ];

  const handleCancelMembership = async () => {
    setIsProcessing(true);

    const selectedReason = reason === 'other' ? otherReason : reason;
    const result = await cancelMembership(selectedReason);

    setIsProcessing(false);

    if (result.success) {
      setIsCancelled(true);
    }
  };

  // Erfolgs-Screen nach Kündigung
  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Mitgliedschaft beendet</h1>
          <p className="text-gray-600 mb-6">
            Deine Mitgliedschaft wurde gekündigt. Du hast noch Zugang bis zum Ende deiner aktuellen Abrechnungsperiode.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Wir wünschen dir alles Gute für deine Zukunft!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Link to="/portal" className="inline-flex items-center gap-2 text-gray-600 hover:text-swiss-red transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Zurück zum Portal
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= s ? 'bg-swiss-red text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-swiss-red' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Reason Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Schade, dass du gehst!</h1>
              <p className="text-gray-600">Hilf uns, besser zu werden. Warum möchtest du kündigen?</p>
            </div>

            <div className="space-y-3 mb-8">
              {cancellationReasons.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReason(r.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    reason === r.id
                      ? 'border-swiss-red bg-swiss-red/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={reason === r.id ? 'text-swiss-red font-medium' : 'text-gray-700'}>
                      {r.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      reason === r.id ? 'border-swiss-red' : 'border-gray-300'
                    }`}>
                      {reason === r.id && <div className="w-3 h-3 bg-swiss-red rounded-full" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {reason === 'other' && (
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="Bitte beschreibe deinen Grund..."
                className="w-full p-4 border border-gray-200 rounded-xl mb-6 resize-none focus:outline-none focus:border-swiss-red"
                rows={3}
              />
            )}

            {reason === 'found_job' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-800 font-medium">Herzlichen Glückwunsch zum neuen Job!</p>
                <p className="text-green-700 text-sm mt-1">
                  Wir freuen uns, dass wir dir auf deinem Weg helfen konnten.
                </p>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!reason || (reason === 'other' && !otherReason.trim())}
              className="w-full bg-swiss-red hover:bg-swiss-red-dark disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Weiter
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Reminder of Benefits */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-swiss-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-swiss-red" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bist du sicher?</h1>
              <p className="text-gray-600">Bei Kündigung verlierst du Zugang zu diesen Vorteilen:</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-swiss-red/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-swiss-red" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{benefit.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <p className="text-amber-800 text-sm">
                <strong>Hinweis:</strong> Gemäß unserer Beitragsordnung §5 gilt: Innerhalb von 14 Tagen nach Beitritt ist eine volle Rückerstattung möglich. Nach Ablauf der 14-Tage-Frist ist eine Rückerstattung ausgeschlossen.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-colors"
              >
                Zurück
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold transition-colors"
              >
                Trotzdem kündigen
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Endgültige Bestätigung</h1>
              <p className="text-gray-600">Bitte bestätige, dass du deine Mitgliedschaft beenden möchtest.</p>
            </div>

            {user && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-1">Mitglied</p>
                <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            )}

            <label className="flex items-start gap-3 mb-8 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-swiss-red focus:ring-swiss-red"
              />
              <span className="text-gray-700 text-sm">
                Ich verstehe, dass meine Mitgliedschaft beendet wird und ich keinen Zugang mehr
                zur Plattform, Community und allen Inhalten haben werde. Eine Rückerstattung ist nur innerhalb von 14 Tagen nach Beitritt möglich (siehe Beitragsordnung §5).
              </span>
            </label>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleCancelMembership}
                disabled={!confirmed || isProcessing}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-semibold transition-colors"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Wird bearbeitet...
                  </span>
                ) : (
                  'Mitgliedschaft beenden'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Help Box */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-600 text-sm mb-2">Probleme oder Fragen?</p>
          <a href="mailto:deinechance@mail.de" className="text-swiss-red font-medium hover:underline">
            deinechance@mail.de
          </a>
        </div>
      </main>
    </div>
  );
};

export default Cancel;
