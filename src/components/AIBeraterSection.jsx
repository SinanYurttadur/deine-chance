import { Link } from 'react-router-dom';
import { MessageCircle, Route, ShieldCheck, Clock, Sparkles, BadgeCheck, ChevronRight } from 'lucide-react';

const benefits = [
  {
    icon: Route,
    title: 'Erstellt deinen persönlichen Plan',
    description: 'Alpi analysiert deine Situation und erstellt einen individuellen Schritt-für-Schritt-Plan für deine Auswanderung.',
  },
  {
    icon: MessageCircle,
    title: 'Beantwortet deine Fragen sofort',
    description: 'Keine Standard-Antworten – Alpi geht auf deine persönliche Lage ein. Job, Familie, Finanzen – frag alles.',
  },
  {
    icon: Clock,
    title: '24/7 für dich da',
    description: 'Kein Termin, keine Wartezeit. Alpi ist rund um die Uhr erreichbar – auch abends und am Wochenende.',
  },
  {
    icon: ShieldCheck,
    title: 'Aktuelles, geprüftes Wissen',
    description: 'Bewilligungen, Steuern, Versicherungen, Behörden – Alpi kennt die aktuellen Regeln und Prozesse.',
  },
  {
    icon: Sparkles,
    title: 'Spart dir tausende Euro',
    description: 'Auswanderungsagenturen kosten 3.000–8.000€. Alpi ist in deiner Mitgliedschaft inklusive.',
  },
  {
    icon: BadgeCheck,
    title: 'Vom Anfang bis zum Ankommen',
    description: 'Von der ersten Idee über Jobsuche, Umzug und Zoll bis zur Anmeldung bei der Gemeinde.',
  },
];

// Fake chat messages for the mockup
const mockMessages = [
  { role: 'assistant', text: 'Grüezi! Ich bin Alpi, dein persönlicher Auswanderer-Berater. Was möchtest du wissen?' },
  { role: 'user', text: 'Was brauche ich für die B-Bewilligung?' },
  { role: 'assistant', text: 'Für die B-Bewilligung brauchst du:\n\n1. Einen Arbeitsvertrag (mind. 12 Monate)\n2. Gültigen Reisepass\n3. Passfoto\n4. Anmeldung bei der Gemeinde innerhalb 14 Tagen\n\nDein Arbeitgeber leitet den Antrag in der Regel für dich ein. Soll ich dir eine Checkliste erstellen?' },
];

const AIBeraterSection = () => {
  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Kein teurer Berater nötig
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Dein persönlicher Auswanderer-Berater.<br className="hidden md:block" />
            <span className="text-swiss-red">Immer da. Kostenlos.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Vergiss teure Agenturen und Relocation-Services. <strong>Alpi</strong> begleitet dich persönlich durch den
            gesamten Auswanderungsprozess – erstellt deinen individuellen Plan und beantwortet jede Frage sofort.
          </p>
        </div>

        {/* Two Column: Chat Mockup + Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Chat Mockup */}
          <div className="relative order-2 lg:order-1">
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-gradient-to-br from-swiss-red/5 to-red-100/50 rounded-3xl blur-xl"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
                <div className="w-9 h-9 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-base">🏔️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Alpi – Dein Auswanderer-Berater</h4>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Immer für dich da
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="px-5 py-4 space-y-3">
                {mockMessages.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-swiss-red' : 'bg-gradient-to-br from-swiss-red to-red-600'
                    }`}>
                      {msg.role === 'user'
                        ? <span className="text-[10px] text-white font-bold">DU</span>
                        : <span className="text-[10px]">🏔️</span>
                      }
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-swiss-red text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input mockup */}
              <div className="border-t border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-400">
                    Frag Alpi etwas...
                  </div>
                  <div className="bg-swiss-red text-white p-2.5 rounded-xl">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white rounded-xl shadow-lg p-2 sm:p-3 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">In deiner Mitgliedschaft inklusive</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="order-1 lg:order-2">
            <div className="space-y-1 mb-8">
              <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold">
                <span className="text-base">🏔️</span>
                Alpi ersetzt deinen teuren Berater
              </div>
            </div>

            <div className="space-y-4">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-swiss-red/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-swiss-red transition-colors">
                    <Icon className="w-5 h-5 text-swiss-red group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-0.5">{title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing comparison */}
            <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-5 border border-red-100">
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">Auswanderungsagentur: 3.000€ – 8.000€</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">Relocation-Berater: 2.000€ – 5.000€</span>
                </div>
                <div className="flex items-center gap-2 text-swiss-red font-bold">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Alpi + komplette Plattform: 249€/Jahr</span>
                </div>
              </div>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-full md:w-auto"
              >
                Jetzt Mitglied werden & Alpi nutzen
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIBeraterSection;
