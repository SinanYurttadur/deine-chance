import { LayoutDashboard, Users, FileText, Headphones, GraduationCap, Building2 } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

const iconMap = {
  0: LayoutDashboard,
  1: Users,
  2: FileText,
  3: Headphones,
  4: GraduationCap,
  5: Building2
};

const ValueGrid = () => {
  const { content } = usePersona();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Deine Vorteile
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ein neuer Lebensabschnitt
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Mit deiner Mitgliedschaft erhältst du alles, was du für einen erfolgreichen
            Start in der Schweiz benötigst.
          </p>
        </div>

        {/* Value Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.values.map((value, index) => {
            const Icon = iconMap[index] || LayoutDashboard;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-swiss-red/20 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-swiss-red/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-swiss-red group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-swiss-red group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>

                {/* Decorative element */}
                <div className="mt-6 h-1 w-12 bg-gray-200 rounded group-hover:w-full group-hover:bg-swiss-red transition-all duration-500"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="#mitglied-werden"
            className="inline-flex items-center justify-center bg-swiss-red hover:bg-swiss-red-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Alle Vorteile sichern
          </a>
        </div>
      </div>
    </section>
  );
};

export default ValueGrid;
