import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Users, Building2, Briefcase, UserCircle, Calculator } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePersona } from '../context/PersonaContext';

const personaIcons = {
  einzelperson: UserCircle,
  familie: Users,
  selbststaendig: Briefcase,
  unternehmer: Building2
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const { currentPersona, switchPersona, allPersonas, content } = usePersona();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPersonaDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const CurrentIcon = personaIcons[currentPersona];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-swiss-red focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Zum Inhalt springen
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo mit Schweizer Kreuz */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-swiss-red rounded-lg flex items-center justify-center relative">
                {/* Schweizer Kreuz */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-5 bg-white rounded-[1px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-2 bg-white rounded-[1px]" />
                </div>
              </div>
              <span className="font-bold text-lg md:text-xl text-gray-900 hidden sm:block">
                Deine Chance e.V.
              </span>
            </Link>
          </div>

          {/* Persona Selector - Desktop */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              <CurrentIcon className="w-4 h-4 text-swiss-red" />
              <span className="text-sm font-medium text-gray-700">{content.shortLabel}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isPersonaDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPersonaDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Ich bin...</p>
                {allPersonas.map((persona) => {
                  const Icon = personaIcons[persona.id];
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        switchPersona(persona.id);
                        setIsPersonaDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                        currentPersona === persona.id ? 'bg-red-50 text-swiss-red' : 'text-gray-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${currentPersona === persona.id ? 'text-swiss-red' : 'text-gray-400'}`} />
                      <span className="font-medium">{persona.label}</span>
                      {currentPersona === persona.id && (
                        <span className="ml-auto w-2 h-2 bg-swiss-red rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {!['selbststaendig', 'unternehmer'].includes(currentPersona) && (
              <a href="#gehaltsrechner" className="flex items-center gap-1.5 text-swiss-red font-semibold text-sm hover:text-swiss-red-dark transition-colors">
                <Calculator className="w-4 h-4" />
                Gehaltsrechner
              </a>
            )}
            <a href="#prozess" className="text-gray-600 hover:text-swiss-red transition-colors font-medium text-sm">
              Wie es funktioniert
            </a>
            <a href="#gruender" className="text-gray-600 hover:text-swiss-red transition-colors font-medium text-sm">
              Unsere Geschichte
            </a>
            <a href="#features" className="text-gray-600 hover:text-swiss-red transition-colors font-medium text-sm">
              Leistungen
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/portal"
                className="flex items-center gap-2 bg-swiss-red hover:bg-swiss-red-dark text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <User className="w-4 h-4" />
                Mein Portal
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-swiss-red transition-colors font-medium text-sm"
                >
                  Anmelden
                </Link>
                <Link
                  to="/register"
                  className="bg-swiss-red hover:bg-swiss-red-dark text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Mitglied werden
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {/* Mobile Persona Selector */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-2">Ich bin...</p>
              <div className="grid grid-cols-2 gap-2">
                {allPersonas.map((persona) => {
                  const Icon = personaIcons[persona.id];
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        switchPersona(persona.id);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        currentPersona === persona.id
                          ? 'bg-swiss-red text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{persona.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <nav className="flex flex-col space-y-3">
              {!['selbststaendig', 'unternehmer'].includes(currentPersona) && (
                <a
                  href="#gehaltsrechner"
                  className="flex items-center gap-2 text-swiss-red font-semibold px-2 py-2 bg-red-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calculator className="w-5 h-5" />
                  Gehaltsrechner
                </a>
              )}
              <a
                href="#prozess"
                className="text-gray-600 hover:text-swiss-red transition-colors font-medium px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Wie es funktioniert
              </a>
              <a
                href="#gruender"
                className="text-gray-600 hover:text-swiss-red transition-colors font-medium px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Unsere Geschichte
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-swiss-red transition-colors font-medium px-2 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Leistungen
              </a>
              {isAuthenticated ? (
                <Link
                  to="/portal"
                  className="bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-3 rounded-full font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Mein Portal
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-swiss-red transition-colors font-medium px-2 py-2 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <Link
                    to="/register"
                    className="bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-3 rounded-full font-semibold text-center transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mitglied werden
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
