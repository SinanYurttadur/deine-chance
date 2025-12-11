import { Users, ThumbsUp, Building, Award } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '489+',
    label: 'Erfolgreiche Bewerbungen',
    description: 'Mitglieder haben Jobs gefunden'
  },
  {
    icon: ThumbsUp,
    value: '97%',
    label: 'Zufriedenheit',
    description: 'Unserer Mitglieder sind zufrieden'
  },
  {
    icon: Building,
    value: '20+',
    label: 'Partner',
    description: 'Schweizer Unternehmen im Netzwerk'
  },
  {
    icon: Award,
    value: '5+',
    label: 'Jahre Erfahrung',
    description: 'Im Bereich Auswanderung'
  }
];

const SocialProof = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-swiss-red/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4 group-hover:bg-swiss-red transition-colors duration-300">
                  <Icon className="w-7 h-7 text-swiss-red group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <p className="text-center text-gray-400 text-sm mb-8">
            Vertraut von Hunderten zufriedener Mitglieder
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {/* Placeholder company logos */}
            {['TrustPilot', 'Google Reviews', 'ProvenExpert', 'Ausgezeichnet.org'].map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">{name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium hidden md:block">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
