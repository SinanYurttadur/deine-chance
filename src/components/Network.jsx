import { Users, Heart, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

const Network = () => {
  const networkStats = [
    { value: '500+', label: 'Aktive Mitglieder', sublabel: 'die das gleiche Ziel teilen' },
    { value: '150+', label: 'Bereits ausgewandert', sublabel: 'und teilen ihre Erfahrungen' },
    { value: '12+', label: 'Kantone vertreten', sublabel: 'von Zürich bis Tessin' }
  ];

  const testimonialQuotes = [
    {
      quote: 'Die Tipps aus der Community haben mir mehr geholfen als jeder Ratgeber.',
      author: 'Marco S.',
      status: 'Seit 8 Monaten in Zürich'
    },
    {
      quote: 'Durch eine Empfehlung aus dem Netzwerk habe ich meinen Job gefunden!',
      author: 'Julia M.',
      status: 'Softwareentwicklerin in Basel'
    },
    {
      quote: 'Endlich Menschen, die verstehen was man durchmacht. Unbezahlbar.',
      author: 'Thomas K.',
      status: 'Gerade im Bewerbungsprozess'
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Unser Netzwerk
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Das Wertvollste?
            <span className="text-swiss-red"> Die Menschen.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Alle unsere Mitglieder teilen dasselbe Ziel: Ein neues Leben in der Schweiz.
            Dieses gemeinsame Vorhaben verbindet und schafft echte Unterstützung –
            wertvoller als jedes Handbuch.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Visual / Network Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-swiss-red/5 to-rose-100 rounded-3xl p-8 md:p-12">
              {/* Central Icon */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-64 h-64 bg-swiss-red/10 rounded-full animate-pulse"></div>
                <div className="absolute w-48 h-48 bg-swiss-red/20 rounded-full"></div>
                <div className="relative w-32 h-32 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center shadow-xl">
                  <Heart className="w-16 h-16 text-white" />
                </div>

                {/* Floating avatars around */}
                <div className="absolute -top-4 left-1/4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-white">
                  MS
                </div>
                <div className="absolute top-1/4 -right-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-white">
                  JK
                </div>
                <div className="absolute bottom-0 right-1/4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-white">
                  AL
                </div>
                <div className="absolute bottom-1/4 -left-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-white">
                  TH
                </div>
                <div className="absolute -bottom-6 left-1/3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-xs font-bold text-gray-600 border-2 border-white">
                  NW
                </div>
              </div>

              {/* Connection lines hint */}
              <div className="mt-12 flex justify-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-0.5 bg-swiss-red/30"></div>
                  <span>Echte Verbindungen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Benefits */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-swiss-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-swiss-red" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gleichgesinnte treffen</h3>
                <p className="text-gray-600">
                  Niemand versteht dich besser als jemand, der den gleichen Weg geht.
                  Tausche dich aus über Ängste, Fragen und Erfolge – ohne Vorurteile.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-swiss-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-swiss-red" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Echte Erfahrungen statt Theorie</h3>
                <p className="text-gray-600">
                  Frag jemanden, der es gemacht hat: Wie war das Vorstellungsgespräch?
                  Welche Bank ist gut? Wie finde ich in Basel eine Wohnung?
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-swiss-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-swiss-red" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kontakte, die Türen öffnen</h3>
                <p className="text-gray-600">
                  Viele Jobs entstehen durch Empfehlungen. Unsere Mitglieder teilen Stellenangebote,
                  empfehlen Arbeitgeber und helfen sich gegenseitig ins neue Leben.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {networkStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <p className="text-4xl md:text-5xl font-bold text-swiss-red mb-2">{stat.value}</p>
              <p className="text-lg font-semibold text-gray-900">{stat.label}</p>
              <p className="text-sm text-gray-500">{stat.sublabel}</p>
            </div>
          ))}
        </div>

        {/* Mini Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonialQuotes.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100"
            >
              <p className="text-gray-700 italic mb-4">"{item.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-swiss-red/10 rounded-full flex items-center justify-center">
                  <span className="text-swiss-red font-semibold text-sm">
                    {item.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.author}</p>
                  <p className="text-xs text-gray-500">{item.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-swiss-red to-red-600 rounded-2xl p-8 md:p-12 text-white max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Werde Teil der Community
            </h3>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
              Starte nicht alleine. Hunderte Menschen warten darauf, ihre Erfahrungen mit dir zu teilen
              und dich auf deinem Weg zu unterstützen.
            </p>
            <a
              href="#mitglied-werden"
              className="inline-flex items-center gap-2 bg-white text-swiss-red px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Jetzt Mitglied werden
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Network;
