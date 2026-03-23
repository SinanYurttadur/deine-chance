import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Lock, CreditCard, CheckCircle, Calendar, XCircle } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

const LeadForm = () => {
  const { content } = usePersona();

  return (
    <section id="mitglied-werden" className="py-20 md:py-32 bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Vereinsmitgliedschaft
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {content.cta.headline}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {content.cta.subline}
            </p>

            {/* Price Box */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Jährliche Mitgliedschaft</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-swiss-red">249€</span>
                    <span className="text-gray-400">/Jahr</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Agenturen verlangen</p>
                  <span className="text-xl font-bold text-gray-300 line-through">3.000€+</span>
                </div>
              </div>

              {/* What you get vs don't */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-2">Bei uns:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>249€/Jahr</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Jederzeit kündbar</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Community & Support</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-red-500 mb-2">Bei Agenturen:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>3.000€+ einmalig</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>Keine Rückerstattung</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span>Oft kein Follow-up</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="space-y-3">
              {[
                { icon: Calendar, text: 'Jährliche Mitgliedschaft – jederzeit zum Jahresende kündbar' },
                { icon: Shield, text: '14 Tage Geld-zurück-Garantie' },
                { icon: Lock, text: 'SSL-verschlüsselte sichere Zahlung' },
                { icon: CreditCard, text: 'Alle gängigen Zahlungsmethoden' }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3 text-gray-600">
                    <Icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - CTA Card */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-swiss-red/10 rounded-full blur-3xl"></div>

            <div className="relative bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-swiss-red rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  {/* Schweizer Kreuz */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-8 bg-white rounded-[1px]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-3 bg-white rounded-[1px]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Werde Vereinsmitglied
                </h3>
                <p className="text-gray-600">
                  Und spare dir tausende Euro für Agenturen
                </p>
              </div>

              {/* What's included */}
              <div className="space-y-3 mb-8">
                {[
                  'Voller Zugang zur Plattform',
                  'Exklusive Jobplattform mit 500+ Stellen',
                  'Alle Dokumentenvorlagen',
                  'Community & Netzwerk',
                  'Persönlicher Support',
                  'Offizielles Mitgliedschaftszertifikat'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* Price Display */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-3xl font-bold text-swiss-red">249€</span>
                  <span className="text-gray-500">/Jahr</span>
                </div>
                <p className="text-sm text-gray-500">
                  Das sind nur <span className="font-semibold">20,75€/Monat</span>
                </p>
              </div>

              {/* CTA Button */}
              <Link
                to="/register"
                className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                Jetzt Mitglied werden
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-center text-sm text-gray-500 mt-4">
                Kein Risiko • Jederzeit kündbar
              </p>

              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center mb-3">Sichere Zahlung mit</p>
                <div className="flex justify-center items-center gap-3 flex-wrap">
                  {['VISA', 'MC', 'PayPal', 'SEPA', 'Klarna'].map((method, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 border border-gray-100"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;
