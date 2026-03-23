import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  ArrowRight,
  X,
  Info,
  Home,
  Heart,
  Utensils,
  Car,
  Wallet,
  ChevronDown
} from 'lucide-react';

// Branchen mit durchschnittlichen Schweizer Gehältern (in CHF)
const INDUSTRIES = [
  { id: 'it', name: 'IT & Software', multiplier: 1.75, avgCH: 110000 },
  { id: 'finance', name: 'Finanzen & Banking', multiplier: 1.85, avgCH: 120000 },
  { id: 'pharma', name: 'Pharma & Chemie', multiplier: 1.70, avgCH: 105000 },
  { id: 'engineering', name: 'Ingenieurwesen & Technik', multiplier: 1.65, avgCH: 100000 },
  { id: 'healthcare', name: 'Gesundheit & Pflege', multiplier: 1.55, avgCH: 90000 },
  { id: 'sales', name: 'Vertrieb & Marketing', multiplier: 1.60, avgCH: 95000 },
  { id: 'consulting', name: 'Beratung & Consulting', multiplier: 1.80, avgCH: 115000 },
  { id: 'hr', name: 'Personal & HR', multiplier: 1.55, avgCH: 88000 },
  { id: 'legal', name: 'Recht & Steuern', multiplier: 1.75, avgCH: 115000 },
  { id: 'logistics', name: 'Logistik & Transport', multiplier: 1.50, avgCH: 75000 },
  { id: 'construction', name: 'Bau & Handwerk', multiplier: 1.60, avgCH: 80000 },
  { id: 'hospitality', name: 'Gastronomie & Hotellerie', multiplier: 1.45, avgCH: 55000 },
  { id: 'education', name: 'Bildung & Wissenschaft', multiplier: 1.50, avgCH: 85000 },
  { id: 'retail', name: 'Einzelhandel & Verkauf', multiplier: 1.45, avgCH: 60000 },
  { id: 'media', name: 'Medien & Kommunikation', multiplier: 1.55, avgCH: 85000 },
  { id: 'automotive', name: 'Automobil & Maschinenbau', multiplier: 1.65, avgCH: 95000 },
  { id: 'energy', name: 'Energie & Umwelt', multiplier: 1.60, avgCH: 90000 },
  { id: 'insurance', name: 'Versicherungen', multiplier: 1.70, avgCH: 100000 },
  { id: 'other', name: 'Andere Branche', multiplier: 1.55, avgCH: 80000 }
];

// Vereinfachte Steuerberechnung
const calculateNet = (gross, country) => {
  if (country === 'de') {
    // Deutschland: ~40% Abgaben (Steuern + Sozialabgaben)
    const taxRate = gross > 60000 ? 0.42 : gross > 40000 ? 0.38 : 0.35;
    return gross * (1 - taxRate);
  } else {
    // Schweiz: ~25% Abgaben (niedriger wegen anderem System)
    const taxRate = 0.25;
    return gross * (1 - taxRate);
  }
};

// Lebenshaltungskosten Differenz (CH ist teurer)
const LIVING_COST_DIFF = 800; // EUR mehr pro Monat in CH

// Wechselkurs
const CHF_TO_EUR = 0.95;

const SalaryCalculatorCompact = () => {
  const [industry, setIndustry] = useState('it');
  const [germanySalary, setGermanySalary] = useState(55000);
  const [showModal, setShowModal] = useState(false);

  const selectedIndustry = INDUSTRIES.find(i => i.id === industry);

  // Berechnung
  const calculation = useMemo(() => {
    const swissSalary = Math.round(germanySalary * selectedIndustry.multiplier);

    const germanyNetYearly = calculateNet(germanySalary, 'de');
    const swissNetYearly = calculateNet(swissSalary, 'ch') * CHF_TO_EUR;

    const germanyNetMonthly = germanyNetYearly / 12;
    const swissNetMonthly = swissNetYearly / 12;

    // Nach Lebenshaltungskosten
    const germanyDisposable = germanyNetMonthly - 1700; // DE Lebenshaltung
    const swissDisposable = swissNetMonthly - 2500; // CH Lebenshaltung (höher)

    const monthlyDiff = Math.round(swissDisposable - germanyDisposable);
    const yearlyDiff = monthlyDiff * 12;
    const percentMore = Math.round((swissNetMonthly / germanyNetMonthly - 1) * 100);

    return {
      swissSalary,
      germanyNetMonthly: Math.round(germanyNetMonthly),
      swissNetMonthly: Math.round(swissNetMonthly),
      germanyDisposable: Math.round(germanyDisposable),
      swissDisposable: Math.round(swissDisposable),
      monthlyDiff,
      yearlyDiff,
      percentMore,
      isWorthIt: monthlyDiff > 0
    };
  }, [germanySalary, selectedIndustry]);

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 sm:p-6 md:p-10 text-white overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-swiss-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-swiss-red/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-swiss-red rounded-xl flex items-center justify-center relative">
              {/* Schweizer Kreuz */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2.5 h-6 bg-white rounded-[1px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-2.5 bg-white rounded-[1px]" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Gehaltsrechner</h2>
              <p className="text-gray-400 text-sm">Was könntest du in der Schweiz verdienen?</p>
            </div>
          </div>

          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {/* Branche */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Deine Branche</label>
              <div className="relative">
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none"
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind.id} value={ind.id} className="text-gray-900">
                      {ind.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Gehalt */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Dein Jahresgehalt (Deutschland)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                <input
                  type="number"
                  value={germanySalary}
                  onChange={(e) => setGermanySalary(Number(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-8 pr-4 py-3 text-white text-lg font-semibold focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none"
                  placeholder="55000"
                />
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-4">
            <input
              type="range"
              min="30000"
              max="150000"
              step="5000"
              value={germanySalary}
              onChange={(e) => setGermanySalary(Number(e.target.value))}
              className="w-full accent-swiss-red h-2 bg-white/20 rounded-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>30.000€</span>
              <span>150.000€</span>
            </div>
          </div>

          {/* Result */}
          <div className="mt-8 bg-white/10 backdrop-blur rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Schweizer Gehalt */}
              <div className="text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">In der Schweiz verdienst du ca.</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                  {calculation.swissSalary.toLocaleString('de-CH')} <span className="text-lg text-gray-400">CHF</span>
                </p>
                <p className="text-sm text-gray-500">Bruttojahresgehalt</p>
              </div>

              {/* Mehr pro Monat */}
              <div className="text-center border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0">
                <p className="text-gray-400 text-sm mb-1">Mehr Geld pro Monat</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${calculation.isWorthIt ? 'text-green-400' : 'text-yellow-400'}`}>
                  {calculation.monthlyDiff > 0 ? '+' : ''}{calculation.monthlyDiff.toLocaleString('de-DE')}€
                </p>
                <p className="text-sm text-gray-500">nach Lebenshaltungskosten</p>
              </div>

              {/* Pro Jahr */}
              <div className="text-center md:text-right">
                <p className="text-gray-400 text-sm mb-1">Das sind pro Jahr</p>
                <p className={`text-2xl sm:text-3xl md:text-4xl font-bold ${calculation.isWorthIt ? 'text-green-400' : 'text-yellow-400'}`}>
                  {calculation.yearlyDiff > 0 ? '+' : ''}{calculation.yearlyDiff.toLocaleString('de-DE')}€
                </p>
                <p className="text-sm text-gray-500">mehr auf dem Konto</p>
              </div>
            </div>

            {/* Percentage Badge */}
            {calculation.isWorthIt && (
              <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{calculation.percentMore}% mehr Netto</span>
                </div>
              </div>
            )}
          </div>

          {/* CTA & Details */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="flex-1 bg-swiss-red hover:bg-swiss-red-dark text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Jetzt starten
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Info className="w-5 h-5" />
              Details ansehen
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-center text-xs text-gray-400">
              <strong className="text-gray-300">⚠️ Alle Angaben ohne Gewähr.</strong> Diese Berechnung dient nur zur Orientierung
              und ersetzt keine professionelle Steuer- oder Finanzberatung. Tatsächliche Werte können je nach Kanton,
              Gemeinde, Familienstand und persönlicher Situation erheblich variieren. Wechselkurs: 1 CHF ≈ 0,95 EUR.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-6 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
              <h3 className="text-xl font-bold text-gray-900">Detaillierte Berechnung</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Vergleichstabelle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Deutschland */}
                <div className="bg-gray-50 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇩🇪</span>
                    <span className="font-bold text-gray-900">Deutschland</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brutto/Jahr</span>
                      <span className="font-semibold">{germanySalary.toLocaleString('de-DE')}€</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Steuern & Abgaben</span>
                      <span>~{Math.round(germanySalary * 0.40).toLocaleString('de-DE')}€</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold">
                      <span>Netto/Monat</span>
                      <span className="text-green-600">{calculation.germanyNetMonthly.toLocaleString('de-DE')}€</span>
                    </div>
                  </div>
                </div>

                {/* Schweiz */}
                <div className="bg-red-50 rounded-2xl p-5 border-2 border-swiss-red">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🇨🇭</span>
                    <span className="font-bold text-gray-900">Schweiz</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brutto/Jahr</span>
                      <span className="font-semibold">{calculation.swissSalary.toLocaleString('de-CH')} CHF</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Steuern & Abgaben</span>
                      <span>~{Math.round(calculation.swissSalary * 0.25).toLocaleString('de-CH')} CHF</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold">
                      <span>Netto/Monat</span>
                      <span className="text-green-600">{calculation.swissNetMonthly.toLocaleString('de-DE')}€*</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lebenshaltungskosten */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Lebenshaltungskosten (monatlich)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 mb-3">🇩🇪 Deutschland</p>
                    {[
                      { icon: Home, label: 'Miete', de: 900, ch: 1800 },
                      { icon: Heart, label: 'Krankenkasse', de: 0, ch: 350, note: 'In Abgaben' },
                      { icon: Utensils, label: 'Lebensmittel', de: 350, ch: 600 },
                      { icon: Car, label: 'Transport', de: 150, ch: 100 },
                      { icon: Wallet, label: 'Sonstiges', de: 300, ch: 400 }
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-medium">{item.de === 0 ? item.note : `${item.de}€`}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Gesamt</span>
                      <span>1.700€</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 mb-3">🇨🇭 Schweiz</p>
                    {[
                      { icon: Home, label: 'Miete', ch: 1800 },
                      { icon: Heart, label: 'Krankenkasse', ch: 350 },
                      { icon: Utensils, label: 'Lebensmittel', ch: 600 },
                      { icon: Car, label: 'Transport', ch: 100 },
                      { icon: Wallet, label: 'Sonstiges', ch: 400 }
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                        <span className="font-medium">{item.ch} CHF</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Gesamt</span>
                      <span>3.250 CHF</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endergebnis */}
              <div className={`rounded-2xl p-6 ${calculation.isWorthIt ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {calculation.isWorthIt ? '✅ Lohnt sich!' : '⚠️ Knapp'}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Nach allen Abzügen und Lebenshaltungskosten
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-3xl font-bold ${calculation.isWorthIt ? 'text-green-600' : 'text-yellow-600'}`}>
                      {calculation.monthlyDiff > 0 ? '+' : ''}{calculation.monthlyDiff}€
                    </p>
                    <p className="text-sm text-gray-500">pro Monat mehr</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">Hinweis</p>
                <p>
                  Diese Berechnung ist eine vereinfachte Schätzung. Die tatsächlichen Werte können je nach
                  Kanton, Gemeinde, Familienstand und persönlicher Situation variieren. Quellensteuer gilt
                  für Ausländer ohne C-Bewilligung. Wechselkurs: 1 CHF ≈ 0,95 EUR.
                </p>
              </div>

              {/* CTA in Modal */}
              <Link
                to="/register"
                onClick={() => setShowModal(false)}
                className="block w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold text-center text-lg transition-all duration-300"
              >
                Jetzt Mitglied werden & durchstarten
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SalaryCalculatorCompact;
