import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Was ist in der Mitgliedschaft enthalten?',
    answer: 'Als Vereinsmitglied erhältst du Zugang zu unserer exklusiven Plattform mit Jobportal, Video-Akademie (8 Module), Wissensbibliothek (13 Kapitel), Dokumentenvorlagen, und unserer aktiven Community. Das Wichtigste: Du wirst Teil eines Netzwerks von Menschen, die das gleiche Ziel haben – ein neues Leben in der Schweiz.'
  },
  {
    question: 'Ist die Mitgliedschaft einmalig oder ein Jahresbeitrag?',
    answer: 'Die Mitgliedschaft kostet 249€ pro Jahr. Das entspricht weniger als 21€ pro Monat für umfassende Unterstützung bei deiner Auswanderung. Als eingetragener Verein (e.V.) ist dies dein Jahres-Mitgliedsbeitrag. Du kannst jährlich entscheiden, ob du verlängern möchtest – es gibt keine automatische Verlängerung.'
  },
  {
    question: 'Was macht Deine Chance e.V. besonders?',
    answer: 'Wir sind kein anonymes Online-Portal, sondern eine echte Gemeinschaft. Unser Netzwerk aus bereits ausgewanderten Mitgliedern und Menschen auf dem Weg in die Schweiz ist unser größter Schatz. Hier findest du echte Erfahrungen, gegenseitige Unterstützung und Kontakte, die kein Geld der Welt kaufen kann.'
  },
  {
    question: 'Für wen ist Deine Chance e.V. geeignet?',
    answer: 'Für alle, die ernsthaft über eine Auswanderung in die Schweiz nachdenken – egal ob Fachkräfte, Quereinsteiger, Familien oder Selbstständige. Besonders profitieren EU/EFTA-Bürger (Deutschland, Österreich, Italien), da die Einwanderung durch das Freizügigkeitsabkommen einfacher ist.'
  },
  {
    question: 'Wie schnell kann ich einen Job in der Schweiz finden?',
    answer: 'Das hängt von deiner Qualifikation, Branche und Flexibilität ab. Viele unserer Mitglieder finden innerhalb von 2-6 Monaten eine Stelle. Durch unser Netzwerk und die Erfahrungsberichte in der Community erhöhen sich deine Chancen erheblich – oft entstehen Jobs durch persönliche Empfehlungen!'
  },
  {
    question: 'Brauche ich Schweizerdeutsch oder Französisch?',
    answer: 'In vielen internationalen Unternehmen und im IT-Bereich ist Englisch oft ausreichend. Hochdeutsch wird in der Deutschschweiz gut verstanden. Für andere Regionen (Romandie, Tessin) sind entsprechende Sprachkenntnisse von Vorteil. In unserer Community findest du Tipps zu Sprachkursen und regionalen Besonderheiten.'
  },
  {
    question: 'Was passiert nach der Anmeldung?',
    answer: 'Du erhältst sofort Zugang zum Mitgliederbereich mit allen Inhalten: Video-Akademie, Wissensbibliothek, Jobportal, Vorlagen und Community. Starte am besten mit dem Einführungsvideo und arbeite dich durch die 8 Module. In der Community kannst du dich direkt vorstellen und mit anderen Mitgliedern vernetzen.'
  },
  {
    question: 'Gibt es eine Geld-zurück-Garantie?',
    answer: 'Ja! Wir bieten eine 14-tägige Geld-zurück-Garantie. Wenn du innerhalb von 14 Tagen feststellst, dass unser Verein nicht zu dir passt, erstatten wir dir den Mitgliedsbeitrag ohne Fragen. Wir sind aber überzeugt: Sobald du die Community kennenlernst, bleibst du dabei.'
  },
  {
    question: 'Kann ich auch ohne Job in die Schweiz?',
    answer: 'Grundsätzlich brauchst du als EU-Bürger einen Arbeitsvertrag für die B-Bewilligung. Aber: In unserer Wissensbibliothek erklären wir alle Möglichkeiten – auch für Selbstständige, Familiennachzug oder Studierende. Unsere Community hilft dir, den richtigen Weg zu finden.'
  }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-lg font-semibold text-gray-900 pr-8 group-hover:text-swiss-red transition-colors">
          {question}
        </span>
        <ChevronDown
          className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-swiss-red' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-20 md:py-32 bg-white">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Häufige Fragen zum Auswandern in die Schweiz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hier findest du Antworten auf die häufigsten Fragen. Hast du weitere Fragen?
            Kontaktiere uns gerne!
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
