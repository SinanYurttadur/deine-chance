import { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  Calculator,
  TrendingUp,
  Euro,
  Wallet,
  Building2,
  Heart,
  Home,
  Utensils,
  Car,
  PiggyBank,
  Info,
  ChevronDown,
  ChevronUp,
  Check,
  Download
} from 'lucide-react';

// Steuer- und Abgabensätze (vereinfacht)
const TAX_CONFIG = {
  germany: {
    // Sozialabgaben (Arbeitnehmeranteil)
    healthInsurance: 0.073, // 7.3% + Zusatzbeitrag
    pensionInsurance: 0.093, // 9.3%
    unemploymentInsurance: 0.012, // 1.2%
    nursingCareInsurance: 0.01525, // 1.525%
    // Einkommensteuer (vereinfachter Durchschnitt)
    getIncomeTax: (gross) => {
      if (gross <= 10908) return 0;
      if (gross <= 62809) return (gross - 10908) * 0.25;
      return (62809 - 10908) * 0.25 + (gross - 62809) * 0.42;
    }
  },
  switzerland: {
    // AHV/IV/EO (Arbeitnehmeranteil)
    ahv: 0.0525,
    // ALV (Arbeitslosenversicherung)
    alv: 0.011,
    // Pensionskasse (BVG, ca. Durchschnitt)
    bvg: 0.075,
    // NBU ist meist vom Arbeitgeber bezahlt
    // Quellensteuer variiert stark nach Kanton
    getSourceTax: (gross, kanton) => {
      const rates = {
        'ZH': 0.10, // Zürich
        'BE': 0.12, // Bern
        'BS': 0.14, // Basel-Stadt
        'GE': 0.15, // Genf
        'ZG': 0.06, // Zug
        'SZ': 0.07, // Schwyz
        'default': 0.11
      };
      const rate = rates[kanton] || rates.default;
      return gross * rate;
    }
  }
};

// Durchschnittliche Lebenshaltungskosten
const LIVING_COSTS = {
  germany: {
    rent: 900, // Miete (Durchschnitt DE)
    health: 0, // Bereits in Sozialabgaben
    food: 350,
    transport: 150,
    other: 300
  },
  switzerland: {
    rent: 1800, // Miete (Durchschnitt CH)
    health: 350, // Krankenkasse Grundversicherung
    food: 600,
    transport: 100, // GA/Halbtax
    other: 400
  }
};

// CHF/EUR Wechselkurs
const EXCHANGE_RATE = 0.95; // 1 CHF = 0.95 EUR

const SalaryCalculator = () => {
  const [germanyGross, setGermanyGross] = useState(55000);
  const [switzerlandGross, setSwitzerlandGross] = useState(95000);
  const [kanton, setKanton] = useState('ZH');
  const [showDetails, setShowDetails] = useState(false);

  // Deutschland Berechnung
  const germanyCalc = useMemo(() => {
    const monthly = germanyGross / 12;
    const socialContributions = germanyGross * (
      TAX_CONFIG.germany.healthInsurance +
      TAX_CONFIG.germany.pensionInsurance +
      TAX_CONFIG.germany.unemploymentInsurance +
      TAX_CONFIG.germany.nursingCareInsurance
    );
    const incomeTax = TAX_CONFIG.germany.getIncomeTax(germanyGross);
    const netYearly = germanyGross - socialContributions - incomeTax;
    const netMonthly = netYearly / 12;

    const livingCosts = Object.values(LIVING_COSTS.germany).reduce((a, b) => a + b, 0);
    const disposable = netMonthly - livingCosts;

    return {
      gross: germanyGross,
      grossMonthly: monthly,
      socialContributions,
      incomeTax,
      netYearly,
      netMonthly,
      livingCosts,
      disposable,
      taxRate: ((socialContributions + incomeTax) / germanyGross * 100).toFixed(1)
    };
  }, [germanyGross]);

  // Schweiz Berechnung
  const switzerlandCalc = useMemo(() => {
    const monthly = switzerlandGross / 12;
    const ahv = switzerlandGross * TAX_CONFIG.switzerland.ahv;
    const alv = Math.min(switzerlandGross, 148200) * TAX_CONFIG.switzerland.alv;
    const bvg = switzerlandGross * TAX_CONFIG.switzerland.bvg;
    const socialContributions = ahv + alv + bvg;
    const sourceTax = TAX_CONFIG.switzerland.getSourceTax(switzerlandGross, kanton);
    const netYearly = switzerlandGross - socialContributions - sourceTax;
    const netMonthly = netYearly / 12;

    const livingCosts = Object.values(LIVING_COSTS.switzerland).reduce((a, b) => a + b, 0);
    const disposable = netMonthly - livingCosts;

    // In EUR umrechnen für Vergleich
    const netMonthlyEur = netMonthly * EXCHANGE_RATE;
    const disposableEur = disposable * EXCHANGE_RATE;

    return {
      gross: switzerlandGross,
      grossMonthly: monthly,
      ahv,
      alv,
      bvg,
      socialContributions,
      sourceTax,
      netYearly,
      netMonthly,
      netMonthlyEur,
      livingCosts,
      disposable,
      disposableEur,
      taxRate: ((socialContributions + sourceTax) / switzerlandGross * 100).toFixed(1)
    };
  }, [switzerlandGross, kanton]);

  // Vergleich
  const comparison = useMemo(() => {
    const netDiff = switzerlandCalc.netMonthlyEur - germanyCalc.netMonthly;
    const netDiffPercent = ((switzerlandCalc.netMonthlyEur / germanyCalc.netMonthly - 1) * 100).toFixed(1);
    const disposableDiff = switzerlandCalc.disposableEur - germanyCalc.disposable;
    const disposableDiffPercent = germanyCalc.disposable > 0
      ? ((switzerlandCalc.disposableEur / germanyCalc.disposable - 1) * 100).toFixed(1)
      : 'N/A';

    return {
      netDiff,
      netDiffPercent,
      disposableDiff,
      disposableDiffPercent,
      worthIt: disposableDiff > 0
    };
  }, [germanyCalc, switzerlandCalc]);

  const kantone = [
    { code: 'ZH', name: 'Zürich' },
    { code: 'BE', name: 'Bern' },
    { code: 'BS', name: 'Basel-Stadt' },
    { code: 'GE', name: 'Genf' },
    { code: 'ZG', name: 'Zug' },
    { code: 'SZ', name: 'Schwyz' },
    { code: 'AG', name: 'Aargau' },
    { code: 'SG', name: 'St. Gallen' }
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    const fmt = (n) => Math.round(n).toLocaleString('de-DE');
    const fmtCHF = (n) => Math.round(n).toLocaleString('de-CH');
    const kantonName = kantone.find(k => k.code === kanton)?.name || kanton;

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Gehaltsvergleich Deutschland – Schweiz', pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Erstellt mit Deine Chance e.V.', pageWidth / 2, y, { align: 'center' });
    y += 14;

    // Germany Section
    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Deutschland', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const deRows = [
      ['Brutto/Jahr', `${fmt(germanyGross)} EUR`],
      ['Sozialabgaben', `-${fmt(germanyCalc.socialContributions)} EUR`],
      ['Einkommensteuer', `-${fmt(germanyCalc.incomeTax)} EUR`],
      ['Netto/Monat', `${fmt(germanyCalc.netMonthly)} EUR`],
      ['Lebenshaltungskosten', `-${fmt(germanyCalc.livingCosts)} EUR`],
      ['Verfuegbar/Monat', `${fmt(germanyCalc.disposable)} EUR`],
    ];
    deRows.forEach(([label, value]) => {
      doc.text(label, 25, y);
      doc.text(value, pageWidth - 25, y, { align: 'right' });
      y += 6;
    });
    doc.text(`Abgabenquote: ${germanyCalc.taxRate}%`, 25, y);
    y += 12;

    // Switzerland Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Schweiz (Kanton ${kantonName})`, 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const chRows = [
      ['Brutto/Jahr', `${fmtCHF(switzerlandGross)} CHF`],
      ['AHV/ALV/BVG', `-${fmtCHF(switzerlandCalc.socialContributions)} CHF`],
      [`Quellensteuer (${kanton})`, `-${fmtCHF(switzerlandCalc.sourceTax)} CHF`],
      ['Netto/Monat', `${fmtCHF(switzerlandCalc.netMonthly)} CHF`],
      ['  (in EUR)', `${fmt(switzerlandCalc.netMonthlyEur)} EUR`],
      ['Lebenshaltung + KK', `-${fmtCHF(switzerlandCalc.livingCosts)} CHF`],
      ['Verfuegbar/Monat', `${fmtCHF(switzerlandCalc.disposable)} CHF`],
      ['  (in EUR)', `${fmt(switzerlandCalc.disposableEur)} EUR`],
    ];
    chRows.forEach(([label, value]) => {
      doc.text(label, 25, y);
      doc.text(value, pageWidth - 25, y, { align: 'right' });
      y += 6;
    });
    doc.text(`Abgabenquote: ${switzerlandCalc.taxRate}%`, 25, y);
    y += 14;

    // Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Zusammenfassung', 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Netto-Differenz/Monat: ${comparison.netDiff > 0 ? '+' : ''}${fmt(comparison.netDiff)} EUR (${comparison.netDiffPercent}%)`, 25, y);
    y += 6;
    doc.text(`Verfuegbar-Differenz/Monat: ${comparison.disposableDiff > 0 ? '+' : ''}${fmt(comparison.disposableDiff)} EUR (${comparison.disposableDiffPercent}%)`, 25, y);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(
      comparison.worthIt
        ? 'Ergebnis: Lohnt sich! Du hast mehr zum Leben in der Schweiz.'
        : 'Ergebnis: Knapp – pruefe genauer und verhandle ein hoeheres Gehalt.',
      25, y
    );
    y += 14;

    // Disclaimer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120);
    const disclaimer = `Hinweis: Diese Berechnung dient zur Orientierung. Die tatsaechlichen Abgaben koennen je nach persoenlicher Situation, Familienstand, Kanton und Gemeinde variieren. Quellensteuer gilt fuer Auslaender ohne C-Bewilligung. Wechselkurs: 1 CHF = ${EXCHANGE_RATE} EUR.`;
    const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 40);
    doc.text(disclaimerLines, 20, y);
    y += disclaimerLines.length * 4 + 6;

    // Date
    const now = new Date();
    doc.text(`Erstellt am ${now.toLocaleDateString('de-DE')} um ${now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`, 20, y);

    doc.save('Gehaltsvergleich-DE-CH.pdf');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Calculator className="w-7 h-7 text-swiss-red" />
          Gehaltsrechner
        </h1>
        <p className="text-gray-600 mt-1">
          Vergleiche dein Gehalt zwischen Deutschland und der Schweiz – inkl. Steuern, Abgaben und Lebenshaltungskosten.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Deutschland */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-xl">
              🇩🇪
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Deutschland</h2>
              <p className="text-sm text-gray-500">Dein aktuelles Gehalt</p>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bruttojahresgehalt (EUR)
          </label>
          <div className="relative">
            <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={germanyGross}
              onChange={(e) => setGermanyGross(Number(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-200 outline-none text-lg font-semibold"
              placeholder="55000"
            />
          </div>
          <input
            type="range"
            min="30000"
            max="150000"
            step="1000"
            value={germanyGross}
            onChange={(e) => setGermanyGross(Number(e.target.value))}
            className="w-full mt-3 accent-gray-900"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>30.000€</span>
            <span>150.000€</span>
          </div>
        </div>

        {/* Schweiz */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-swiss-red">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-swiss-red rounded-lg flex items-center justify-center text-xl">
              🇨🇭
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Schweiz</h2>
              <p className="text-sm text-gray-500">Dein Zielgehalt</p>
            </div>
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bruttojahresgehalt (CHF)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">CHF</span>
            <input
              type="number"
              value={switzerlandGross}
              onChange={(e) => setSwitzerlandGross(Number(e.target.value) || 0)}
              className="w-full pl-14 pr-4 py-3 border border-gray-200 rounded-xl focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none text-lg font-semibold"
              placeholder="95000"
            />
          </div>
          <input
            type="range"
            min="50000"
            max="250000"
            step="1000"
            value={switzerlandGross}
            onChange={(e) => setSwitzerlandGross(Number(e.target.value))}
            className="w-full mt-3 accent-swiss-red"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50.000 CHF</span>
            <span>250.000 CHF</span>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arbeitskanton (für Quellensteuer)
            </label>
            <select
              value={kanton}
              onChange={(e) => setKanton(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none"
            >
              {kantone.map(k => (
                <option key={k.code} value={k.code}>{k.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div className={`rounded-2xl p-6 ${comparison.worthIt ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              {comparison.worthIt ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <Info className="w-6 h-6 text-yellow-600" />
              )}
              {comparison.worthIt ? 'Lohnt sich!' : 'Knapp – prüfe genauer'}
            </h3>
            <p className="text-gray-600 mt-1">
              {comparison.worthIt
                ? `Du hast monatlich ca. ${Math.round(comparison.disposableDiff)}€ mehr zum Leben.`
                : 'Bei diesem Gehaltsverhältnis ist der Vorteil gering. Verhandle mehr!'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {comparison.netDiff > 0 ? '+' : ''}{Math.round(comparison.netDiff)}€
            </div>
            <p className="text-sm text-gray-500">mehr Netto/Monat</p>
          </div>
        </div>
      </div>

      {/* Detailed Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Deutschland Details */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
            <span className="font-semibold">🇩🇪 Deutschland</span>
            <span className="text-sm opacity-80">{germanyCalc.taxRate}% Abgaben</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Brutto/Jahr</span>
              <span className="font-semibold">{germanyGross.toLocaleString('de-DE')}€</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>- Sozialabgaben</span>
              <span>-{Math.round(germanyCalc.socialContributions).toLocaleString('de-DE')}€</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>- Einkommensteuer</span>
              <span>-{Math.round(germanyCalc.incomeTax).toLocaleString('de-DE')}€</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
              <span>Netto/Monat</span>
              <span className="text-green-600">{Math.round(germanyCalc.netMonthly).toLocaleString('de-DE')}€</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 text-sm">
              <span>- Lebenshaltung</span>
              <span>-{germanyCalc.livingCosts.toLocaleString('de-DE')}€</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
              <span className="font-medium">Verfügbar</span>
              <span className="font-bold text-lg">{Math.round(germanyCalc.disposable).toLocaleString('de-DE')}€</span>
            </div>
          </div>
        </div>

        {/* Schweiz Details */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-swiss-red text-white p-4 flex items-center justify-between">
            <span className="font-semibold">🇨🇭 Schweiz</span>
            <span className="text-sm opacity-80">{switzerlandCalc.taxRate}% Abgaben</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Brutto/Jahr</span>
              <span className="font-semibold">{switzerlandGross.toLocaleString('de-CH')} CHF</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>- AHV/ALV/BVG</span>
              <span>-{Math.round(switzerlandCalc.socialContributions).toLocaleString('de-CH')} CHF</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>- Quellensteuer ({kanton})</span>
              <span>-{Math.round(switzerlandCalc.sourceTax).toLocaleString('de-CH')} CHF</span>
            </div>
            <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
              <span>Netto/Monat</span>
              <span className="text-green-600">{Math.round(switzerlandCalc.netMonthly).toLocaleString('de-CH')} CHF</span>
            </div>
            <div className="flex justify-between items-center text-gray-400 text-xs">
              <span>≈ in EUR</span>
              <span>{Math.round(switzerlandCalc.netMonthlyEur).toLocaleString('de-DE')}€</span>
            </div>
            <div className="flex justify-between items-center text-gray-500 text-sm">
              <span>- Lebenshaltung + KK</span>
              <span>-{switzerlandCalc.livingCosts.toLocaleString('de-CH')} CHF</span>
            </div>
            <div className="bg-swiss-red/10 rounded-lg p-3 flex justify-between items-center">
              <span className="font-medium">Verfügbar</span>
              <span className="font-bold text-lg">{Math.round(switzerlandCalc.disposable).toLocaleString('de-CH')} CHF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Living Costs Breakdown */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">Lebenshaltungskosten im Detail</span>
        {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      {showDetails && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🇩🇪 Deutschland (Durchschnitt)</h4>
              <div className="space-y-3">
                {[
                  { icon: Home, label: 'Miete (2-Zi)', value: LIVING_COSTS.germany.rent },
                  { icon: Heart, label: 'Krankenkasse', value: 0, note: 'In Sozialabgaben' },
                  { icon: Utensils, label: 'Lebensmittel', value: LIVING_COSTS.germany.food },
                  { icon: Car, label: 'Transport', value: LIVING_COSTS.germany.transport },
                  { icon: Wallet, label: 'Sonstiges', value: LIVING_COSTS.germany.other }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{item.label}</span>
                      </div>
                      <span className="font-medium">
                        {item.note || `${item.value}€`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">🇨🇭 Schweiz (Durchschnitt)</h4>
              <div className="space-y-3">
                {[
                  { icon: Home, label: 'Miete (2-Zi)', value: LIVING_COSTS.switzerland.rent },
                  { icon: Heart, label: 'Krankenkasse', value: LIVING_COSTS.switzerland.health },
                  { icon: Utensils, label: 'Lebensmittel', value: LIVING_COSTS.switzerland.food },
                  { icon: Car, label: 'Transport (GA)', value: LIVING_COSTS.switzerland.transport },
                  { icon: Wallet, label: 'Sonstiges', value: LIVING_COSTS.switzerland.other }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{item.label}</span>
                      </div>
                      <span className="font-medium">{item.value} CHF</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Hinweis</p>
            <p>
              Diese Berechnung dient zur Orientierung. Die tatsächlichen Abgaben können je nach
              persönlicher Situation, Familienstand, Kanton und Gemeinde variieren. Quellensteuer
              gilt für Ausländer ohne C-Bewilligung. Wechselkurs: 1 CHF ≈ {EXCHANGE_RATE} EUR.
            </p>
          </div>
        </div>
        <button
          onClick={exportPDF}
          className="self-end flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          PDF exportieren
        </button>
      </div>

      {/* Key Takeaways */}
      <div className="bg-gradient-to-r from-swiss-red to-red-600 rounded-2xl p-6 text-white">
        <h3 className="font-bold text-lg mb-4">Die wichtigsten Erkenntnisse</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Höhere Gehälter',
              desc: 'Schweizer Gehälter sind oft 40-80% höher als in Deutschland'
            },
            {
              title: 'Niedrigere Steuern',
              desc: 'Weniger Sozialabgaben, aber Krankenkasse selbst zahlen'
            },
            {
              title: 'Höhere Kosten',
              desc: 'Miete und Lebenshaltung sind deutlich teurer'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">{item.title}</span>
              </div>
              <p className="text-white/80 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
