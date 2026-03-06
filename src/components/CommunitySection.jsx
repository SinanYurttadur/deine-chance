import { MessageCircle, Route, ShieldCheck, Clock, Sparkles, BadgeCheck } from 'lucide-react';
import AIChat from './AIChat';

const benefits = [
  {
    icon: Route,
    title: 'Persönlicher Plan',
    description: 'Alpi erstellt mit dir zusammen einen individuellen Schritt-für-Schritt-Plan für deine Auswanderung.',
  },
  {
    icon: MessageCircle,
    title: 'Individuelle Antworten',
    description: 'Keine Standard-Infos – Alpi geht auf deine persönliche Situation ein und beantwortet genau deine Fragen.',
  },
  {
    icon: Clock,
    title: '24/7 verfügbar',
    description: 'Kein Termin nötig. Alpi ist rund um die Uhr für dich da – auch abends und am Wochenende.',
  },
  {
    icon: ShieldCheck,
    title: 'Geprüftes Wissen',
    description: 'Basiert auf aktuellen Informationen zu Bewilligungen, Steuern, Versicherungen und Behördenprozessen.',
  },
  {
    icon: Sparkles,
    title: 'Kein teurer Berater nötig',
    description: 'Spar dir tausende Euro für Agenturen. Alpi begleitet dich kostenlos als Teil deiner Mitgliedschaft.',
  },
  {
    icon: BadgeCheck,
    title: 'Vom Anfang bis zum Ankommen',
    description: 'Von der ersten Idee über Jobsuche und Umzug bis zur Anmeldung in der Gemeinde – Alpi kennt jeden Schritt.',
  },
];

const CommunitySection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dein Auswanderer-Berater</h1>
        <p className="text-gray-600 mt-1">Alpi begleitet dich persönlich durch den gesamten Auswanderungsprozess – kein teurer Berater nötig.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chat – takes more space */}
        <div className="lg:col-span-3">
          <AIChat />
        </div>

        {/* Benefits Box */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg">🏔️</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Alpi</h3>
                <p className="text-gray-400 text-xs">Dein persönlicher Auswanderer-Berater</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-5 leading-relaxed">
              Warum tausende Euro für Agenturen oder Relocation-Services ausgeben? Alpi ersetzt den teuren Berater – persönlich, individuell und immer erreichbar.
            </p>
            <div className="space-y-3">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 bg-swiss-red/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-swiss-red" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;
