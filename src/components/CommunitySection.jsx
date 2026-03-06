import { useState } from 'react';
import { templates, usefulLinks } from '../data/communityData';
import {
  Download,
  Link as LinkIcon,
  ExternalLink,
  FileText,
  Bot,
} from 'lucide-react';
import AIChat from './AIChat';

const CommunitySection = ({ user }) => {
  const [activeSubTab, setActiveSubTab] = useState('chat');

  const downloadTemplate = (template) => {
    const blob = new Blob([template.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Community</h1>
        <p className="text-gray-600 mt-1">Erhalte Unterstützung, lade Vorlagen herunter und finde nützliche Links.</p>
      </div>

      {/* Sub-Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-4">
        {[
          { id: 'chat', name: 'KI-Assistent', icon: Bot },
          { id: 'vorlagen', name: 'Vorlagen & Downloads', icon: Download },
          { id: 'links', name: 'Nützliche Links', icon: LinkIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeSubTab === tab.id
                  ? 'bg-swiss-red text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* AI Chat View */}
      {activeSubTab === 'chat' && (
        <AIChat />
      )}

      {/* Templates View */}
      {activeSubTab === 'vorlagen' && (
        <div className="space-y-8">
          {Object.values(templates).map(category => (
            <div key={category.title}>
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">{category.emoji}</span>
                {category.title}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {category.items.map(template => (
                  <div key={template.id} className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-swiss-red/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-swiss-red" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <p className="text-xs text-gray-500">{template.type} • {template.downloads.toLocaleString()} Downloads</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    <button
                      onClick={() => downloadTemplate(template)}
                      className="w-full bg-gray-100 hover:bg-swiss-red hover:text-white text-gray-700 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Herunterladen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Useful Links View */}
      {activeSubTab === 'links' && (
        <div className="space-y-8">
          {usefulLinks.map(category => (
            <div key={category.category}>
              <h3 className="font-bold text-gray-900 text-lg mb-4">{category.category}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.links.map(link => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md hover:border-swiss-red/30 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-swiss-red/10 rounded-lg flex items-center justify-center group-hover:bg-swiss-red transition-colors">
                        <ExternalLink className="w-4 h-4 text-swiss-red group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-swiss-red transition-colors">{link.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunitySection;
