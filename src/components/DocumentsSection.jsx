import { useState, useEffect } from 'react';
import { templates } from '../data/communityData';
import { FileText, Download, Eye, Copy, X, CheckCircle, Search, Star } from 'lucide-react';
import AlpiCTA from './AlpiCTA';

// Alle Vorlagen aus communityData flach als Array
const getAllTemplates = () => {
  const allTemplates = [];
  Object.values(templates).forEach(category => {
    category.items.forEach(item => {
      allTemplates.push({
        ...item,
        category: category.title,
        categoryEmoji: category.emoji
      });
    });
  });
  return allTemplates;
};

// Category filter keys matching template object keys
const categoryFilters = [
  { key: null, label: 'Alle' },
  { key: 'bewerbung', label: 'Bewerbung' },
  { key: 'wohnung', label: 'Wohnung' },
  { key: 'steuern', label: 'Steuern' },
  { key: 'familie', label: 'Familie' },
];

// Documents Section Component
const DocumentsSection = ({ setActiveTab }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [viewTemplate, setViewTemplate] = useState(null);
  const [copied, setCopied] = useState(false);
  const [docSearch, setDocSearch] = useState('');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('deinechance_doc_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('deinechance_doc_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (templateId) => {
    setFavorites(prev =>
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const downloadTemplate = (template) => {
    const blob = new Blob([template.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Filter templates by active category, search text, and favorites
  const getFilteredTemplates = () => {
    let sourceCategories;
    if (activeCategory === 'favorites') {
      // Show all categories but only favorited items
      sourceCategories = templates;
    } else if (activeCategory) {
      sourceCategories = { [activeCategory]: templates[activeCategory] };
    } else {
      sourceCategories = templates;
    }

    const searchLower = docSearch.toLowerCase().trim();
    const result = {};

    Object.entries(sourceCategories).forEach(([key, category]) => {
      let items = category.items;

      // Filter by favorites if "Favoriten" tab is active
      if (activeCategory === 'favorites') {
        items = items.filter(t => favorites.includes(t.id));
      }

      // Filter by search text
      if (searchLower) {
        items = items.filter(t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
        );
      }

      if (items.length > 0) {
        result[key] = { ...category, items };
      }
    });

    return result;
  };

  const filteredCategories = getFilteredTemplates();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vorlagen & Checklisten</h1>
          <p className="text-gray-600 mt-1">Alle Vorlagen für deine Auswanderung – kostenlos als Mitglied.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          {getAllTemplates().length} Vorlagen verfügbar
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="search"
          value={docSearch}
          onChange={(e) => setDocSearch(e.target.value)}
          placeholder="Vorlagen durchsuchen..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-swiss-red"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {categoryFilters.map(cat => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-swiss-red text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <button
          onClick={() => setActiveCategory('favorites')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeCategory === 'favorites'
              ? 'bg-swiss-red text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Star className={`w-4 h-4 ${activeCategory === 'favorites' ? 'fill-white' : ''}`} />
          Favoriten
        </button>
      </div>

      {/* Template List */}
      <div className="space-y-4">
        {Object.keys(filteredCategories).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Star className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">
              {activeCategory === 'favorites'
                ? 'Noch keine Favoriten gespeichert'
                : 'Keine Vorlagen gefunden'}
            </p>
            <p className="text-sm mt-1">
              {activeCategory === 'favorites'
                ? 'Markiere Vorlagen mit dem Stern, um sie hier zu sehen.'
                : 'Versuche einen anderen Suchbegriff.'}
            </p>
          </div>
        )}
        {Object.values(filteredCategories).flatMap(category =>
          category.items.map(template => (
            <div key={template.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-swiss-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-swiss-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{template.type} • {template.downloads.toLocaleString()} Downloads</p>
                  <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { setViewTemplate(template); setCopied(false); }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-swiss-red hover:text-white text-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Anzeigen
                    </button>
                    <button
                      onClick={() => downloadTemplate(template)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-swiss-red hover:text-white text-gray-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Herunterladen
                    </button>
                    <button
                      onClick={() => toggleFavorite(template.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-yellow-50 text-gray-700 transition-colors"
                      title={favorites.includes(template.id) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                    >
                      <Star className={`w-4 h-4 ${favorites.includes(template.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {viewTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewTemplate(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-swiss-red/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-swiss-red" />
                </div>
                <h2 className="font-bold text-gray-900">{viewTemplate.name}</h2>
              </div>
              <button onClick={() => setViewTemplate(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 rounded-xl p-4 leading-relaxed">
                {viewTemplate.content}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => copyContent(viewTemplate.content)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-swiss-red hover:bg-swiss-red-dark text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Kopiert!' : 'Kopieren'}
              </button>
              <button
                onClick={() => setViewTemplate(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      <AlpiCTA
        text="Unsicher bei der Bewerbung? Frag Alpi – er hilft dir bei Lebenslauf, Anschreiben und mehr."
        onClick={() => setActiveTab('community')}
      />
    </div>
  );
};

export { getAllTemplates };
export default DocumentsSection;
