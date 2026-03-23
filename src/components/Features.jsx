import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePersona } from '../context/PersonaContext';

const Features = () => {
  const { content } = usePersona();

  return (
    <section id="features" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Alles inklusive
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {content.features.headline}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Mit deiner Vereinsmitgliedschaft erhältst du Zugang zu allem, was du brauchst –
            für nur <span className="text-swiss-red font-semibold">249€ im Jahr</span> statt tausende Euro für Agenturen.
          </p>
        </div>

        {/* Features List */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-12">
            <div className="grid md:grid-cols-2 gap-5">
              {content.features.items.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-7 h-7 bg-swiss-red rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-gray-700 leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Comparison */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Vergleiche selbst:
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 line-through">Auswanderungsagentur: 3.000€ - 8.000€</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-400 line-through">Relocation-Service: 2.000€ - 5.000€</span>
                      </div>
                      <div className="flex items-center gap-3 text-swiss-red font-semibold">
                        <Check className="w-4 h-4" />
                        <span>Deine Chance e.V. Mitgliedschaft: 249€/Jahr</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center bg-swiss-red hover:bg-swiss-red-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    Jetzt 90% sparen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
