import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import usePageTitle from '../hooks/usePageTitle';
import { usefulLinks } from '../data/communityData';
import KnowledgeSection from '../components/KnowledgeSection';
import CommunitySection from '../components/CommunitySection';
import SalaryCalculator from '../components/SalaryCalculator';
import VideoAcademy from '../components/VideoAcademy';
import AlpiCTA from '../components/AlpiCTA';
import DocumentsSection, { getAllTemplates } from '../components/DocumentsSection';
import { jsPDF } from 'jspdf';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  Download,
  Play,
  CheckCircle,
  ExternalLink,
  Menu,
  BookOpen,
  Calculator,
  Bot,
  Copy,
  AlertTriangle,
  Share2,
  MessageCircle,
  Mail,
  Heart,
  Pencil
} from 'lucide-react';

// Job Portals für die Schweiz
const jobPortals = [
  {
    name: 'jobs.ch',
    url: 'https://www.jobs.ch/de/stellenangebote/',
    description: 'Größte Jobbörse der Schweiz',
    logo: '🇨🇭',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Indeed Schweiz',
    url: 'https://ch.indeed.com/',
    description: 'Internationale Jobbörse',
    logo: '🔍',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'LinkedIn Jobs',
    url: 'https://www.linkedin.com/jobs/search/?location=Switzerland',
    description: 'Business-Netzwerk & Jobs',
    logo: '💼',
    color: 'from-sky-500 to-sky-600'
  },
  {
    name: 'jobup.ch',
    url: 'https://www.jobup.ch/de/jobs/',
    description: 'Jobs in der Romandie',
    logo: '🏔️',
    color: 'from-emerald-500 to-emerald-600'
  }
];

// Beliebte Berufsfelder mit direkten Suchlinks
const popularFields = [
  { name: 'IT & Software', query: 'software+developer', icon: '💻' },
  { name: 'Gesundheit & Pflege', query: 'pflege+gesundheit', icon: '🏥' },
  { name: 'Handwerk & Bau', query: 'handwerker+bau', icon: '🔧' },
  { name: 'Finance & Banking', query: 'finance+banking', icon: '💰' },
  { name: 'Marketing & Sales', query: 'marketing+sales', icon: '📈' },
  { name: 'Gastronomie & Hotel', query: 'gastro+hotel', icon: '🍽️' }
];


const Portal = () => {
  usePageTitle('Mein Portal');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [messageCopied, setMessageCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Search handler: navigate to the most relevant tab based on keywords
  const handleSearch = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return;

    const tabKeywords = {
      jobs: ['job', 'jobs', 'stelle', 'stellen', 'stellenangebot', 'arbeit', 'beruf', 'karriere', 'bewerbung', 'arbeitsmarkt'],
      documents: ['dokument', 'vorlage', 'vorlagen', 'template', 'checkliste', 'download', 'lebenslauf', 'anschreiben', 'muster'],
      knowledge: ['wissen', 'bibliothek', 'kapitel', 'lernen', 'guide', 'ratgeber', 'phase', 'auswandern', 'umzug'],
      calculator: ['rechner', 'calculator', 'gehalt', 'salary', 'lohn', 'netto', 'brutto', 'steuer'],
      webinars: ['video', 'videos', 'akademie', 'modul', 'module', 'kurs', 'tutorial', 'webinar'],
    };

    for (const [tab, keywords] of Object.entries(tabKeywords)) {
      if (keywords.some(kw => q.includes(kw))) {
        setActiveTab(tab);
        setSearchQuery('');
        return;
      }
    }
  };

  // Load chapter progress from Supabase on mount
  useEffect(() => {
    if (!user?.id) return;

    supabase
      .from('user_progress')
      .select('item_id')
      .eq('user_id', user.id)
      .eq('item_type', 'chapter')
      .then(({ data, error }) => {
        if (error) {
          console.error('Fortschritt laden fehlgeschlagen:', error);
          return;
        }
        if (data) {
          setCompletedChapters(data.map(row => Number(row.item_id)));
        }
      });
  }, [user?.id]);

  const markChapterComplete = useCallback((chapterId) => {
    if (!user?.id || completedChapters.includes(chapterId)) return;

    setCompletedChapters(prev => [...prev, chapterId]);

    supabase
      .from('user_progress')
      .upsert({ user_id: user.id, item_type: 'chapter', item_id: chapterId }, { onConflict: 'user_id,item_type,item_id' })
      .then(({ error }) => {
        if (error) console.error('Fortschritt speichern fehlgeschlagen:', error);
      });
  }, [user?.id, completedChapters]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Zertifikat als PDF herunterladen
  const downloadCertificate = () => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Hintergrund
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, width, height, 'F');

      // Roter Rahmen
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(3);
      doc.rect(10, 10, width - 20, height - 20);

      // Innerer Rahmen
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.5);
      doc.rect(15, 15, width - 30, height - 30);

      // Logo/Badge - Schweizer Flagge
      doc.setFillColor(220, 38, 38);
      doc.roundedRect(width / 2 - 15, 25, 30, 30, 3, 3, 'F');
      // Weißes Kreuz
      doc.setFillColor(255, 255, 255);
      doc.rect(width / 2 - 2.5, 30, 5, 20, 'F'); // Vertikaler Balken
      doc.rect(width / 2 - 10, 37.5, 20, 5, 'F'); // Horizontaler Balken

      // Titel
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.text('DEINE CHANCE E.V.', width / 2, 65, { align: 'center' });

      // Zertifikat Titel
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(32);
      doc.setFont('helvetica', 'bold');
      doc.text('MITGLIEDSCHAFTSZERTIFIKAT', width / 2, 85, { align: 'center' });

      // Linie
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(1);
      doc.line(width / 2 - 60, 92, width / 2 + 60, 92);

      // Text "Hiermit bestätigen wir"
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Hiermit bestätigen wir, dass', width / 2, 108, { align: 'center' });

      // Name
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      const fullName = `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`;
      doc.text(fullName, width / 2, 125, { align: 'center' });

      // Mitglied Text
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('ordentliches Mitglied des Vereins Deine Chance e.V. ist.', width / 2, 138, { align: 'center' });

      // Mitgliedsnummer
      doc.setTextColor(220, 38, 38);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Mitgliedsnummer: ${user.certificateNumber || user.certificate_number || 'Wird generiert'}`, width / 2, 152, { align: 'center' });

      // Datum
      const memberSince = user.accessGrantedAt || user.access_granted_at || user.created_at;
      const dateStr = memberSince ? new Date(memberSince).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('de-DE');
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Mitglied seit: ${dateStr}`, width / 2, 162, { align: 'center' });

      // Standorte
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text('Stuttgart, Deutschland  •  Zürich, Schweiz', width / 2, height - 25, { align: 'center' });

      // PDF speichern
      doc.save(`Zertifikat_${user.firstName || user.first_name}_${user.lastName || user.last_name}_DeineChance.pdf`);
    } catch {
      alert('Zertifikat konnte nicht erstellt werden. Bitte versuche es erneut.');
    }
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'knowledge', name: 'Wissensbibliothek', icon: BookOpen, badge: '13' },
    { id: 'jobs', name: 'Stellenangebote', icon: Briefcase, badge: '500+' },
    { id: 'calculator', name: 'Gehaltsrechner', icon: Calculator, badge: 'Neu' },
    { id: 'documents', name: 'Vorlagen & Checklisten', icon: FileText },
    { id: 'community', name: 'Alpi – Berater', icon: Bot },
    { id: 'links', name: 'Nützliche Links', icon: ExternalLink },
    { id: 'webinars', name: 'Videos', icon: Play },
    { id: 'referral', name: 'Freunde einladen', icon: Share2 },
    { id: 'settings', name: 'Einstellungen', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-swiss-red rounded-lg flex items-center justify-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-5 bg-white rounded-[1px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-2 bg-white rounded-[1px]" />
              </div>
            </div>
            <span className="font-bold text-lg">Deine Chance</span>
          </Link>

          {/* User Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-swiss-red rounded-full flex items-center justify-center text-white font-semibold">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Aktives Mitglied
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-swiss-red text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${
                      activeTab === item.id ? 'bg-white/20' : 'bg-swiss-red/10 text-swiss-red'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Menü öffnen"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative hidden sm:block">
                <label htmlFor="portal-search" className="sr-only">Suche</label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="portal-search"
                  type="search"
                  placeholder="Jobs, Dokumente suchen..."
                  className="pl-10 pr-4 py-2 w-64 lg:w-96 border border-gray-200 rounded-xl focus:outline-none focus:border-swiss-red"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(searchQuery); }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-4 lg:p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-swiss-red to-red-600 rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    Willkommen, {user.firstName}! 👋
                  </h1>
                  <p className="text-white/80 mb-4">
                    Starte deine Auswanderungs-Journey. Wir begleiten dich Schritt für Schritt.
                  </p>
                  <button
                    onClick={() => setActiveTab('knowledge')}
                    className="bg-white text-swiss-red px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Zur Wissensbibliothek
                  </button>
                </div>
              </div>

              {/* Onboarding Progress Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Video-Module', value: `${Math.min(parseInt(localStorage.getItem('deinechance_video_step') || '0', 10), 12)}/12`, icon: Play, change: 'Video-Akademie starten', onClick: () => setActiveTab('webinars') },
                  { label: 'Wissen', value: `${completedChapters.length}/13`, icon: BookOpen, change: 'Kapitel lesen', onClick: () => setActiveTab('knowledge') },
                  { label: 'Alpi', value: '24/7', icon: Bot, change: 'Frag deinen Berater', onClick: () => setActiveTab('community') },
                  { label: 'Vorlagen', value: '13', icon: FileText, change: 'Downloads verfügbar', onClick: () => setActiveTab('documents') }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <button
                      key={i}
                      onClick={stat.onClick}
                      className="bg-white rounded-xl p-5 shadow-sm text-left hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-swiss-red/10 rounded-lg flex items-center justify-center group-hover:bg-swiss-red transition-colors">
                          <Icon className="w-5 h-5 text-swiss-red group-hover:text-white transition-colors" />
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-swiss-red transition-colors" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-xs text-swiss-red mt-1">{stat.change}</p>
                    </button>
                  );
                })}
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {/* Quick Start Guide */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">Deine nächsten Schritte</h2>
                    <p className="text-sm text-gray-500 mt-1">Folge diesem Leitfaden für einen erfolgreichen Start</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { step: 1, title: 'Einführungsvideo ansehen', description: 'Lerne die Plattform kennen', tab: 'webinars', icon: Play, done: false },
                      { step: 2, title: 'Wissensbibliothek starten', description: 'Phase 1: Entscheidung durcharbeiten', tab: 'knowledge', icon: BookOpen, done: false },
                      { step: 3, title: 'Alpi fragen', description: 'Dein persönlicher Auswanderer-Berater hilft dir weiter', tab: 'community', icon: Bot, done: false },
                      { step: 4, title: 'Vorlagen herunterladen', description: 'Bewerbung & Lebenslauf vorbereiten', tab: 'documents', icon: Download, done: false },
                      { step: 5, title: 'Jobsuche starten', description: 'Nutze unsere Jobportal-Links', tab: 'jobs', icon: Briefcase, done: false }
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.step}
                          onClick={() => setActiveTab(item.tab)}
                          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-swiss-red/30 hover:bg-gray-50 transition-all group text-left"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            item.done ? 'bg-green-500 text-white' : 'bg-swiss-red/10 text-swiss-red group-hover:bg-swiss-red group-hover:text-white'
                          } transition-colors`}>
                            {item.done ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-400">Schritt {item.step}</span>
                            </div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-swiss-red transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  {/* Video-Akademie Teaser */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-swiss-red/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-swiss-red rounded-xl flex items-center justify-center mb-4">
                        <Play className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Video-Akademie</h3>
                      <p className="text-gray-400 text-sm mb-4">8 Module für deine Auswanderung</p>
                      <button
                        onClick={() => setActiveTab('webinars')}
                        className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-2 rounded-lg font-medium transition-colors"
                      >
                        Jetzt starten
                      </button>
                    </div>
                  </div>

                  {/* Beliebte Dokumente */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">Top Vorlagen</h2>
                      <button
                        onClick={() => setActiveTab('documents')}
                        className="text-swiss-red text-xs font-medium hover:underline"
                      >
                        Alle →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {getAllTemplates().slice(0, 4).map((template, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{template.categoryEmoji}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">{template.name}</p>
                              <p className="text-xs text-gray-500">{template.downloads.toLocaleString()} Downloads</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Knowledge Tab */}
          {activeTab === 'knowledge' && (
            <KnowledgeSection
              setActiveTab={setActiveTab}
              completedChapters={completedChapters}
              markAsComplete={markChapterComplete}
            />
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jobsuche Schweiz</h1>
                <p className="text-gray-600 mt-1">Finde deinen Traumjob über die besten Schweizer Jobportale.</p>
              </div>

              {/* Job Portals Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {jobPortals.map((portal) => (
                  <a
                    key={portal.name}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl shadow-sm p-6 border-2 border-gray-100 hover:border-swiss-red/30 hover:shadow-lg transition-all"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${portal.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                      {portal.logo}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-swiss-red transition-colors">{portal.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{portal.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-swiss-red text-sm font-medium">
                      Jobs durchsuchen <ExternalLink className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>

              {/* Quick Search by Field */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
                <h2 className="font-bold text-lg mb-4">Schnellsuche nach Berufsfeld</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {popularFields.map((field) => (
                    <a
                      key={field.name}
                      href={`https://www.jobs.ch/de/stellenangebote/?term=${field.query}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl p-4 text-center transition-colors group"
                    >
                      <span className="text-2xl block mb-2">{field.icon}</span>
                      <span className="text-sm font-medium group-hover:text-swiss-red transition-colors">{field.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              <AlpiCTA
                text="Fragen zur Jobsuche in der Schweiz? Alpi hilft dir mit Tipps zu Bewerbung, Gehalt und Arbeitsmarkt."
                onClick={() => setActiveTab('community')}
              />
            </div>
          )}

          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <SalaryCalculator />
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <DocumentsSection setActiveTab={setActiveTab} />
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <CommunitySection user={user} />
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nützliche Links</h1>
                <p className="text-gray-600 mt-1">Wichtige Websites und Portale für deine Auswanderung in die Schweiz.</p>
              </div>
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
              <AlpiCTA
                text="Nicht sicher, welche Seite du brauchst? Frag Alpi – er kennt alle wichtigen Behörden und Portale."
                onClick={() => setActiveTab('community')}
              />
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'webinars' && (
            <VideoAcademy />
          )}

          {/* Freunde einladen Tab */}
          {activeTab === 'referral' && (
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <div className="w-16 h-16 bg-swiss-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-swiss-red" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Hilf anderen in die Schweiz</h1>
                <p className="text-gray-600">
                  Teile deine Chance – lade Freunde und Bekannte ein, die auch den Schritt in die Schweiz wagen wollen.
                </p>
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                {/* Link kopieren */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-3">Dein Einladungs-Link</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-mono text-sm truncate">
                      https://deinechance24.org
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('https://deinechance24.org');
                        setLinkCopied(true);
                        setTimeout(() => setLinkCopied(false), 2000);
                      }}
                      className={`px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2 text-sm whitespace-nowrap ${
                        linkCopied
                          ? 'bg-green-100 text-green-700'
                          : 'bg-swiss-red text-white hover:bg-swiss-red-dark'
                      }`}
                    >
                      {linkCopied ? (
                        <><CheckCircle className="w-4 h-4" /> Kopiert!</>
                      ) : (
                        <><Copy className="w-4 h-4" /> Kopieren</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Teilen-Buttons */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-3">Direkt teilen</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent('Ich bin Mitglied bei Deine Chance e.V. – die Plattform hat mir beim Auswandern in die Schweiz extrem geholfen. Schau mal rein: https://deinechance24.org')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white py-3 px-4 rounded-xl font-medium transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent('Tipp: Deine Chance e.V. – Auswandern in die Schweiz')}&body=${encodeURIComponent('Hi,\n\nich bin Mitglied bei Deine Chance e.V. – eine Plattform, die beim Auswandern in die Schweiz hilft. Von Jobsuche bis Behördengänge ist alles abgedeckt.\n\nSchau mal rein: https://deinechance24.org\n\nLiebe Grüße')}`}
                      className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      Per E-Mail
                    </a>
                  </div>
                </div>

                {/* Vorformulierte Nachricht */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900">Vorformulierte Nachricht</h2>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('Ich bin Mitglied bei Deine Chance e.V. – die Plattform hat mir beim Auswandern in die Schweiz extrem geholfen. Wissens-Kapitel, Job-Netzwerk, Community und persönliche Beratung – alles an einem Ort. Schau mal rein: https://deinechance24.org');
                        setMessageCopied(true);
                        setTimeout(() => setMessageCopied(false), 2000);
                      }}
                      className={`text-sm px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        messageCopied
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {messageCopied ? (
                        <><CheckCircle className="w-3.5 h-3.5" /> Kopiert!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Kopieren</>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                    Ich bin Mitglied bei Deine Chance e.V. – die Plattform hat mir beim Auswandern in die Schweiz extrem geholfen. Wissens-Kapitel, Job-Netzwerk, Community und persönliche Beratung – alles an einem Ort. Schau mal rein: https://deinechance24.org
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>

              <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">Profil</h2>
                    {!editingProfile && (
                      <button
                        onClick={() => {
                          setEditFirstName(user.firstName || '');
                          setEditLastName(user.lastName || '');
                          setEditingProfile(true);
                          setProfileSaved(false);
                        }}
                        className="text-gray-400 hover:text-swiss-red transition-colors"
                        title="Profil bearbeiten"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {editingProfile ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="w-16 h-16 bg-swiss-red rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {editFirstName?.charAt(0)}{editLastName?.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Vorname</label>
                            <input
                              type="text"
                              value={editFirstName}
                              onChange={(e) => setEditFirstName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-swiss-red focus:border-transparent outline-none transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-500 mb-1">Nachname</label>
                            <input
                              type="text"
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-swiss-red focus:border-transparent outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{user.email}</p>
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={async () => {
                            if (!editFirstName.trim() || !editLastName.trim()) {
                              alert('Bitte gib Vor- und Nachname ein.');
                              return;
                            }
                            setProfileSaving(true);
                            const { error } = await supabase
                              .from('profiles')
                              .update({ first_name: editFirstName.trim(), last_name: editLastName.trim() })
                              .eq('id', user.id);
                            setProfileSaving(false);
                            if (error) {
                              alert('Fehler beim Speichern: ' + error.message);
                            } else {
                              setEditingProfile(false);
                              setProfileSaved(true);
                              setTimeout(() => setProfileSaved(false), 2000);
                            }
                          }}
                          disabled={profileSaving}
                          className="bg-swiss-red hover:bg-swiss-red-dark text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {profileSaving ? 'Speichern...' : 'Speichern'}
                        </button>
                        <button
                          onClick={() => setEditingProfile(false)}
                          disabled={profileSaving}
                          className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-swiss-red rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-gray-500">{user.email}</p>
                        {profileSaved && (
                          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Profil gespeichert
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Mitgliedschaft</h2>
                  {user.cancelled_at && user.membershipStatus === 'active' ? (
                    <div className="bg-amber-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600" />
                        <div>
                          <p className="font-medium text-amber-800">Gekündigt – Zugang bis Laufzeitende</p>
                          <p className="text-sm text-amber-600">Mitglied seit {new Date(user.accessGrantedAt).toLocaleDateString('de-DE')}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-medium text-green-800">Aktive Mitgliedschaft</p>
                            <p className="text-sm text-green-600">Mitglied seit {new Date(user.accessGrantedAt).toLocaleDateString('de-DE')}</p>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/kuendigen"
                        className="inline-block mt-4 text-sm text-gray-400 hover:text-red-500 hover:underline transition-colors"
                      >
                        Mitgliedschaft beenden
                      </Link>
                    </>
                  )}
                  <p className="text-sm text-gray-500 mt-3">
                    Mitgliedsnummer: <span className="font-mono">{user.certificateNumber}</span>
                  </p>
                </div>

                <div className="p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Zertifikat</h2>
                  <button
                    onClick={downloadCertificate}
                    className="bg-swiss-red hover:bg-swiss-red-dark text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Zertifikat herunterladen
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Portal;
