import { useState } from 'react';
import { Quote, MapPin, Calendar, Users, Heart, Lightbulb, ArrowRight, Play, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FounderStory = () => {
  const [activeStep, setActiveStep] = useState(0);

  const journeySteps = [
    {
      year: '2017',
      title: 'Der Sprung ins Ungewisse',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      content: 'Als junger Ingenieur aus Deutschland wagte ich den Schritt in die Schweiz. Voller Hoffnung, aber ohne Plan. Die Realität traf mich hart: Behördenchaos, Wohnungsnot, kulturelle Unterschiede.'
    },
    {
      year: '7 Jahre',
      title: 'Die Lernkurve',
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      content: 'Falsche Krankenversicherung, Steuern nicht optimiert, den falschen Kanton gewählt. Ich machte jeden teuren Fehler, den man machen kann. Aber mit jedem Fehler lernte ich.'
    },
    {
      year: '50+',
      title: 'Freunde & Familie',
      icon: Users,
      color: 'from-emerald-500 to-green-500',
      content: '"Vale, kannst du mir helfen?" Erst Freunde, dann Familie, dann Bekannte. Ich half ihnen, meine Fehler zu vermeiden – und sah, wie viel einfacher es sein kann.'
    },
    {
      year: '2024',
      title: 'Deine Chance entsteht',
      icon: Heart,
      color: 'from-swiss-red to-red-600',
      content: 'Know-how und Netzwerk lösen nahezu jedes Problem. Keine teuren Berater – nur Menschen, die sich gegenseitig helfen. Für 249€/Jahr statt tausende Euro.'
    }
  ];

  return (
    <section id="gruender" className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Modern Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-swiss-red rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-gray-600">Die Geschichte dahinter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Warum ich <span className="text-swiss-red">Deine Chance e.V.</span>
            <br />gegründet habe
          </h2>
        </div>

        {/* Main Content - Bento Grid Style */}
        <div className="grid lg:grid-cols-12 gap-6 mb-16">
          {/* Large Founder Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl md:rounded-[2rem] p-5 sm:p-8 md:p-10 text-white relative overflow-hidden group">
            {/* Animated gradient orb */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-swiss-red/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              {/* Profile */}
              <div className="flex items-start gap-5 mb-8">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face"
                    alt="Valentin - Gründer"
                    className="w-20 h-20 rounded-2xl object-cover shadow-2xl shadow-swiss-red/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Valentin</h3>
                  <p className="text-gray-400 text-sm">Gründer & Vereinsmitglied</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-swiss-red" />
                    <span className="text-xs text-gray-400">Zürich, Schweiz</span>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="relative mb-8">
                <Quote className="absolute -top-2 -left-1 w-8 h-8 text-swiss-red/20" />
                <p className="text-base md:text-xl text-gray-300 leading-relaxed pl-6 font-light italic">
                  "Die ersten 7 Jahre in der Schweiz waren die härtesten meines Lebens.
                  Mit dem richtigen Netzwerk hätte ich mir Jahre an Frustration ersparen können."
                </p>
              </div>

              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '2017', label: 'Ausgewandert' },
                  { value: '50+', label: 'Geholfen' },
                  { value: '2024', label: 'Verein' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-3 text-center border border-white/10">
                    <div className="text-xl font-bold text-swiss-red">{stat.value}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Journey Steps - Interactive Timeline */}
          <div className="lg:col-span-7 space-y-4">
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 group ${
                    isActive
                      ? 'bg-gray-50 border-swiss-red shadow-lg shadow-swiss-red/10'
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg ${isActive ? 'scale-110' : 'group-hover:scale-105'} transition-transform`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-swiss-red text-white' : 'bg-gray-100 text-gray-500'}`}>
                          {step.year}
                        </span>
                        <h4 className={`font-bold text-sm sm:text-base ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                          {step.title}
                        </h4>
                      </div>
                      <p className={`text-xs sm:text-sm leading-relaxed transition-all duration-300 ${
                        isActive ? 'text-gray-600 max-h-40 opacity-100' : 'text-gray-400 max-h-0 opacity-0 overflow-hidden'
                      }`}>
                        {step.content}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-all ${
                      isActive ? 'text-swiss-red rotate-90' : 'text-gray-300 group-hover:text-gray-400'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Section - Promise + Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Promise Card */}
          <div className="bg-gradient-to-br from-swiss-red to-red-600 rounded-2xl md:rounded-[2rem] p-5 sm:p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-3 py-1 text-sm font-medium mb-6">
                <Heart className="w-4 h-4" />
                Mein Versprechen
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 leading-tight">
                Du musst nicht dieselben Fehler machen wie ich.
              </h3>
              <p className="text-white/80 mb-8">
                Mit unserem Netzwerk und Know-how sparst du dir Jahre an Frustration und tausende Euro an Beratungskosten.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-white text-swiss-red px-6 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all group shadow-xl"
              >
                Werde Teil der Community
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '500+', label: 'Mitglieder', sublabel: 'im Verein' },
              { value: '97%', label: 'Erfolgsquote', sublabel: 'bei Auswanderung' },
              { value: '7+', label: 'Jahre', sublabel: 'Erfahrung' },
              { value: '3.000€', label: 'Ersparnis', sublabel: 'vs. Agenturen' }
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-center hover:bg-gray-100 transition-colors group">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 group-hover:text-swiss-red transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-gray-700 mt-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;
