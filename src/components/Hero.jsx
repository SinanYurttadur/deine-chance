import { Link } from 'react-router-dom';
import { CheckCircle, Star, ArrowRight, TrendingDown, Clock, Briefcase, Home, Shield, BookOpen, Users } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

const Hero = () => {
  const { content } = usePersona();

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-white via-gray-50 to-red-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center bg-red-100 text-swiss-red px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 fill-swiss-red" />
              {content.hero.badge}
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {content.hero.headline}
            </h1>

            {/* Subline */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {content.hero.subline}
            </p>

            {/* Price Comparison Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Vereinsmitgliedschaft</p>
                  <div className="flex items-baseline gap-2 sm:gap-3">
                    <span className="text-3xl sm:text-4xl font-bold text-swiss-red">249€</span>
                    <span className="text-gray-400">/Jahr</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Statt Agenturkosten von</p>
                  <span className="text-xl sm:text-2xl font-bold text-gray-300 line-through">3.000€+</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span className="font-medium">90% günstiger</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Jederzeit kündbar</span>
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-3 mb-8">
              {content.hero.bullets.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-swiss-red flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center bg-swiss-red hover:bg-swiss-red-dark text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                Jetzt Mitglied werden
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#gruender"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 transition-all duration-300"
              >
                Unsere Geschichte
              </a>
            </div>
          </div>

          {/* Right Content - Animated Journey Illustration (hidden on mobile) */}
          <div className="hidden lg:block order-1 lg:order-2 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background decorations */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-200 rounded-full blur-2xl opacity-40"></div>

              {/* Animated Illustration Card */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8">
                {/* Mountain Skyline SVG */}
                <div className="relative mb-6">
                  <svg viewBox="0 0 400 160" className="w-full" fill="none">
                    {/* Sky gradient */}
                    <defs>
                      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e3a5f" />
                        <stop offset="100%" stopColor="#2d4a7a" />
                      </linearGradient>
                      <linearGradient id="mountainGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6b7280" />
                        <stop offset="100%" stopColor="#4b5563" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="160" rx="12" fill="url(#skyGrad)" />
                    {/* Stars */}
                    <circle cx="50" cy="20" r="1.5" fill="white" opacity="0.6">
                      <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="150" cy="35" r="1" fill="white" opacity="0.4">
                      <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="300" cy="15" r="1.5" fill="white" opacity="0.5">
                      <animate attributeName="opacity" values="0.5;1;0.5" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="350" cy="40" r="1" fill="white" opacity="0.3">
                      <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />
                    </circle>
                    {/* Back mountains */}
                    <polygon points="0,160 40,80 100,120 160,60 220,100 280,50 340,90 400,70 400,160" fill="#374151" opacity="0.5" />
                    {/* Front mountains */}
                    <polygon points="0,160 60,90 120,130 200,70 260,110 320,65 380,100 400,85 400,160" fill="#4b5563" />
                    {/* Snow caps */}
                    <polygon points="190,70 200,70 210,80 195,78" fill="white" opacity="0.8" />
                    <polygon points="310,65 320,65 330,78 315,75" fill="white" opacity="0.8" />
                    {/* Swiss flag on peak */}
                    <rect x="195" y="52" width="14" height="14" rx="2" fill="#FF0000">
                      <animate attributeName="y" values="52;49;52" dur="3s" repeatCount="indefinite" />
                    </rect>
                    <rect x="200" y="54.5" width="4" height="9" rx="0.5" fill="white">
                      <animate attributeName="y" values="54.5;51.5;54.5" dur="3s" repeatCount="indefinite" />
                    </rect>
                    <rect x="197.5" y="57" width="9" height="4" rx="0.5" fill="white">
                      <animate attributeName="y" values="57;54;57" dur="3s" repeatCount="indefinite" />
                    </rect>
                    {/* Green meadow */}
                    <ellipse cx="200" cy="160" rx="220" ry="25" fill="#22c55e" opacity="0.3" />
                  </svg>
                </div>

                {/* Animated Journey Steps */}
                <div className="space-y-3">
                  {[
                    { icon: Briefcase, label: 'Traumjob finden', sublabel: '500+ Stellen in der Schweiz', delay: '0s' },
                    { icon: Home, label: 'Wohnung & Anmeldung', sublabel: 'Schritt für Schritt begleitet', delay: '0.15s' },
                    { icon: Shield, label: 'Bewilligungen & Versicherung', sublabel: 'Alle Formulare & Vorlagen', delay: '0.3s' },
                    { icon: BookOpen, label: 'Wissen & Beratung', sublabel: 'KI-Berater Alpi hilft 24/7', delay: '0.45s' },
                    { icon: Users, label: 'Community & Netzwerk', sublabel: 'Du bist nicht allein', delay: '0.6s' },
                  ].map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10 hover:bg-white/15 transition-colors animate-fade-in-up"
                        style={{ animationDelay: step.delay }}
                      >
                        <div className="w-10 h-10 bg-swiss-red rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-semibold text-sm">{step.label}</p>
                          <p className="text-gray-400 text-xs truncate">{step.sublabel}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 ml-auto" />
                      </div>
                    );
                  })}
                </div>

                {/* Bottom badge */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <div className="flex -space-x-2">
                    {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map((color, i) => (
                      <div key={i} className={`w-6 h-6 ${color} rounded-full border-2 border-gray-900 flex items-center justify-center text-[8px] text-white font-bold`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <span>Bereits 250+ Mitglieder vertrauen uns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
