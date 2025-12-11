import { Link } from 'react-router-dom';
import { CheckCircle, Star, ArrowRight, TrendingDown, Clock } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

const Hero = () => {
  const { content } = usePersona();

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-br from-white via-gray-50 to-red-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Vereinsmitgliedschaft</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-swiss-red">249€</span>
                    <span className="text-gray-400">/Jahr</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Statt Agenturkosten von</p>
                  <span className="text-2xl font-bold text-gray-300 line-through">3.000€+</span>
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

          {/* Right Content - HeyGen Video */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Background decorations */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-200 rounded-full blur-2xl opacity-40"></div>

              {/* Video Container */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-white">
                <div className="aspect-[9/16] sm:aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://app.heygen.com/embeds/063b9d17dab742619c02d3f45755dba8"
                    title="So funktioniert Deine Chance"
                    frameBorder="0"
                    allow="encrypted-media; fullscreen"
                    allowFullScreen
                    className="w-full h-full"
                  />
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
