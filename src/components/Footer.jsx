import { Link } from 'react-router-dom';
import { Mail, MapPin, Calculator } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { currentPersona } = usePersona();
  const showSalaryCalculator = !['selbststaendig', 'unternehmer'].includes(currentPersona);

  const footerLinks = {
    service: [
      ...(showSalaryCalculator ? [{ label: 'Gehaltsrechner', href: '#gehaltsrechner', isAnchor: true, highlight: true }] : []),
      { label: 'Wie es funktioniert', href: '#prozess', isAnchor: true },
      { label: 'Leistungen', href: '#features', isAnchor: true },
      { label: 'Erfahrungen', href: '#testimonials', isAnchor: true },
      { label: 'Preise', href: '#mitglied-werden', isAnchor: true }
    ],
    legal: [
      { label: 'Impressum', href: '/legal#impressum' },
      { label: 'Datenschutz', href: '/legal#datenschutz' },
      { label: 'AGB', href: '/legal#agb' },
      { label: 'Beitragsordnung', href: '/legal#beitragsordnung' }
    ],
    support: [
      { label: 'FAQ', href: '#faq', isAnchor: true },
      { label: 'Mitgliedschaft beenden', href: '/kuendigen' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-swiss-red rounded-lg flex items-center justify-center relative">
                {/* Schweizer Kreuz */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-5 bg-white rounded-[1px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-2 bg-white rounded-[1px]" />
                </div>
              </div>
              <span className="font-bold text-xl">Deine Chance e.V.</span>
            </a>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Dein Partner für die erfolgreiche Auswanderung in die Schweiz.
              Professionell, persönlich und zuverlässig seit 2019.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:deinechance@mail.de" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-swiss-red" />
                <span>deinechance@mail.de</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-swiss-red" />
                <span>Stuttgart, Deutschland</span>
              </div>
            </div>
          </div>

          {/* Service Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Service</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`transition-colors ${
                      link.highlight
                        ? 'text-swiss-red hover:text-red-400 font-semibold flex items-center gap-2'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.highlight && <Calculator className="w-4 h-4" />}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Rechtliches</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} Deine Chance e.V. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-500 text-sm">
                Made with <span className="text-swiss-red">&#9829;</span> in der Schweiz und Deutschland
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
