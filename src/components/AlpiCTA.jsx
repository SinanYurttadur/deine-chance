import { ChevronRight } from 'lucide-react';

// Alpi CTA banner – reused across tabs
const AlpiCTA = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 flex items-center gap-4 text-left group hover:shadow-lg transition-shadow"
  >
    <div className="w-11 h-11 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
      <span className="text-lg">🏔️</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white font-semibold text-sm">{text}</p>
      <p className="text-gray-400 text-xs mt-0.5">Alpi – Dein Auswanderer-Berater</p>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" />
  </button>
);

export default AlpiCTA;
