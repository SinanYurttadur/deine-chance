import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { templates } from '../data/communityData';
import KnowledgeSection from '../components/KnowledgeSection';
import CommunitySection from '../components/CommunitySection';
import SalaryCalculator from '../components/SalaryCalculator';
import { jsPDF } from 'jspdf';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  MapPin,
  Building2,
  Clock,
  Star,
  Download,
  Play,
  Calendar,
  MessageCircle,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Menu,
  X,
  BookOpen,
  Calculator
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

// Community Job-Empfehlungen (von Mitgliedern geteilt)
const communityJobs = [
  {
    id: 1,
    title: 'Suche Elektriker für unser Team',
    company: 'Firma eines Mitglieds',
    location: 'Winterthur',
    type: 'Vollzeit',
    sharedBy: 'Marco S.',
    date: '2024-12-10',
    contact: 'Nachricht im Forum'
  },
  {
    id: 2,
    title: 'IT-Support gesucht',
    company: 'Startup (Kontakt über Community)',
    location: 'Zürich',
    type: 'Vollzeit',
    sharedBy: 'Anna K.',
    date: '2024-12-09',
    contact: 'Nachricht im Forum'
  },
  {
    id: 3,
    title: 'Pflegefachperson für Spitex',
    company: 'Empfehlung von Mitglied',
    location: 'Bern',
    type: 'Teilzeit möglich',
    sharedBy: 'Julia M.',
    date: '2024-12-08',
    contact: 'Nachricht im Forum'
  }
];

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


// Documents Section Component
const DocumentsSection = () => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumente & Vorlagen</h1>
          <p className="text-gray-600 mt-1">Alle Vorlagen für deine Auswanderung – kostenlos als Mitglied.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          {getAllTemplates().length} Vorlagen verfügbar
        </div>
      </div>

      {/* Categories */}
      {Object.values(templates).map(category => (
        <div key={category.title} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <span className="text-2xl">{category.emoji}</span>
            <div>
              <h2 className="font-bold text-gray-900">{category.title}</h2>
              <p className="text-sm text-gray-500">{category.items.length} Vorlagen</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {category.items.map((template) => (
              <div key={template.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-swiss-red/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-swiss-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-500">{template.type} • {template.downloads.toLocaleString()} Downloads</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <button
                  onClick={() => downloadTemplate(template)}
                  className="w-full bg-gray-100 hover:bg-swiss-red hover:text-white text-gray-700 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Herunterladen
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Pro Tip */}
      <div className="bg-gradient-to-r from-swiss-red to-red-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">💡</span>
        </div>
        <div>
          <h3 className="font-bold mb-1">Tipp: Lass dir helfen!</h3>
          <p className="text-white/80 text-sm">
            Unsicher bei der Bewerbung? In der Community findest du Mitglieder,
            die dir Feedback zu deinem Lebenslauf geben können. Schweizer Mitglieder
            kennen die lokalen Standards!
          </p>
        </div>
      </div>
    </div>
  );
};

const Portal = () => {
  usePageTitle('Mein Portal');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Zertifikat als PDF herunterladen
  const downloadCertificate = () => {
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
    doc.text(`Mitgliedsnummer: ${user.certificateNumber || user.certificate_number || 'DC-2024-XXXXX'}`, width / 2, 152, { align: 'center' });

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
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'knowledge', name: 'Wissensbibliothek', icon: BookOpen, badge: '13' },
    { id: 'jobs', name: 'Stellenangebote', icon: Briefcase, badge: '523' },
    { id: 'calculator', name: 'Gehaltsrechner', icon: Calculator, badge: 'Neu' },
    { id: 'documents', name: 'Dokumente', icon: FileText },
    { id: 'community', name: 'Community', icon: Users },
    { id: 'webinars', name: 'Videos', icon: Play },
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-swiss-red text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
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
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-swiss-red rounded-full"></span>
              </button>
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Video-Module', value: '0/8', icon: Play, change: 'Video-Akademie starten', onClick: () => setActiveTab('webinars') },
                  { label: 'Wissen', value: '0/13', icon: BookOpen, change: 'Kapitel lesen', onClick: () => setActiveTab('knowledge') },
                  { label: 'Community', value: 'Aktiv', icon: Users, change: 'Beiträge entdecken', onClick: () => setActiveTab('community') },
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
              <div className="grid lg:grid-cols-3 gap-8">
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
                      { step: 3, title: 'Community beitreten', description: 'Stelle dich vor und vernetze dich', tab: 'community', icon: Users, done: false },
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
            <KnowledgeSection setActiveTab={setActiveTab} />
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Jobsuche Schweiz</h1>
                <p className="text-gray-600 mt-1">Finde deinen Traumjob über die besten Schweizer Jobportale und unsere Community.</p>
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

              {/* Community Jobs */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-swiss-red" />
                      Jobs aus der Community
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Von Mitgliedern geteilte Stellen und Empfehlungen</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('community')}
                    className="text-swiss-red text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    Eigenen Job teilen <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {communityJobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-12 h-12 bg-swiss-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-6 h-6 text-swiss-red" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                              <p className="text-gray-600">{job.company}</p>
                            </div>
                            <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                              Neu
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" /> {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {job.date}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              Geteilt von <span className="font-medium text-gray-900">{job.sharedBy}</span>
                            </p>
                            <button
                              onClick={() => setActiveTab('community')}
                              className="mt-2 sm:mt-0 bg-swiss-red hover:bg-swiss-red-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                            >
                              Im Forum kontaktieren
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Tipp: Nutze das Netzwerk!</h3>
                  <p className="text-gray-600 text-sm">
                    Viele Jobs in der Schweiz werden über persönliche Empfehlungen vergeben.
                    Stelle dich in unserer Community vor und erzähle, was du suchst –
                    unsere Mitglieder haben oft Insider-Tipps!
                  </p>
                  <button
                    onClick={() => setActiveTab('community')}
                    className="mt-3 text-swiss-red font-medium text-sm hover:underline flex items-center gap-1"
                  >
                    Zur Community <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <SalaryCalculator />
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <DocumentsSection />
          )}

          {/* Community Tab */}
          {activeTab === 'community' && (
            <CommunitySection user={user} />
          )}

          {/* Videos Tab */}
          {activeTab === 'webinars' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Video-Akademie</h1>
                <p className="text-gray-600 mt-2">Dein kompletter Video-Kurs für die Auswanderung in die Schweiz – Schritt für Schritt erklärt.</p>
              </div>

              {/* Intro Video */}
              <div className="bg-gradient-to-r from-swiss-red to-red-600 rounded-2xl p-6 text-white">
                <div className="grid lg:grid-cols-2 gap-6 items-center">
                  <div>
                    <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-4">Einführung</span>
                    <h2 className="text-2xl font-bold mb-3">Willkommen in der Video-Akademie!</h2>
                    <p className="text-white/80 mb-4">
                      Bevor du mit den Modulen startest, schau dir dieses Einführungsvideo an.
                      Hier erfährst du, wie die Akademie aufgebaut ist und wie du am besten vorgehst.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Play className="w-4 h-4" /> 8 Module
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Selbstbestimmt lernen
                      </span>
                    </div>
                  </div>
                  <div className="aspect-video bg-black/20 rounded-xl overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://app.heygen.com/embeds/c9645c14a5fa4beea59b9435d98cc6c5"
                      title="Einführung in die Video-Akademie"
                      frameBorder="0"
                      allow="encrypted-media; fullscreen"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Module Grid */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Die 8 Module</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Modul 1 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-900 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/19897a2215434ebe9de7cfa5f8aed608"
                        title="Modul 1: Jobsuche in der Schweiz"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 1</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Jobsuche in der Schweiz</h3>
                      <p className="text-gray-600 text-sm mb-3">Wie du den perfekten Job findest – Portale, Bewerbung, Arbeitsvertrag.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verfügbar</span>
                      </div>
                    </div>
                  </div>

                  {/* Modul 2 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-900 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/a0af1b6bf5ee416e9f56069acbea6216"
                        title="Modul 2: Wohnungssuche"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 2</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Wohnungssuche</h3>
                      <p className="text-gray-600 text-sm mb-3">Portale, Bewerbungsunterlagen, WG als Einstieg, Betrugsfälle vermeiden.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verfügbar</span>
                      </div>
                    </div>
                  </div>

                  {/* Modul 3 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-900 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/195dfc3cd31a4a6ab57eacb34e8d033b"
                        title="Modul 3: Anmeldung & Bewilligung"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 3</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Anmeldung & Bewilligung</h3>
                      <p className="text-gray-600 text-sm mb-3">Gemeinde, Migrationsamt, B-Bewilligung – alle Schritte erklärt.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verfügbar</span>
                      </div>
                    </div>
                  </div>

                  {/* Modul 4 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-900 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/b94b2b43099b4b9da617a3a9feed014d"
                        title="Modul 4: Krankenversicherung"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 4</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Krankenversicherung</h3>
                      <p className="text-gray-600 text-sm mb-3">Grundversicherung, Zusatzversicherung, Franchise – so sparst du Geld.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verfügbar</span>
                      </div>
                    </div>
                  </div>

                  {/* Modul 5 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-900 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/2742058ebc4948b29b444425445f4868"
                        title="Modul 5: Bankkonto & Finanzen"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 5</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Bankkonto & Finanzen</h3>
                      <p className="text-gray-600 text-sm mb-3">Konto eröffnen, Lohn, 3-Säulen-System, Steuern verstehen.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verfügbar</span>
                      </div>
                    </div>
                  </div>

                  {/* Modul 6 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-900 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/6913fe78c2cb4f00b9c896a7ac1448c0"
                        title="Modul 6: Umzug & Zoll"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 6</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Umzug & Zoll</h3>
                      <p className="text-gray-600 text-sm mb-3">Formular 18.44, Auto verzollen, Führerschein umtauschen.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verfügbar</span>
                      </div>
                    </div>
                  </div>

                  {/* Modul 7 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                        <div className="w-16 h-16 bg-swiss-red rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 7</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Familie & Kinder</h3>
                      <p className="text-gray-600 text-sm mb-3">Familiennachzug, Schule, Kita, Kinderzulagen in der Schweiz.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Video folgt</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">In Produktion</span>
                      </div>
                    </div>
                  </div>

                  {/* Modul 8 */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gray-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10">
                        <div className="w-16 h-16 bg-swiss-red rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-swiss-red text-white text-xs font-bold px-2 py-1 rounded">Modul 8</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2">Ankommen & Integration</h3>
                      <p className="text-gray-600 text-sm mb-3">Die ersten Wochen, Netzwerk aufbauen, Schweizer Kultur verstehen.</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Video folgt</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">In Produktion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bonus Videos Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Bonus-Videos</h2>
                <div className="grid lg:grid-cols-2 gap-4">
                  {/* Bonus 1 - Willkommensvideo */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="aspect-video bg-gray-900">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/82c8684cd4004a8dbfd1a0fbcd9fff5c"
                        title="Willkommen bei Deine Chance e.V."
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">Bonus</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Willkommen bei Deine Chance e.V.</h3>
                      <p className="text-gray-600 text-sm">Dein Einstieg in die Plattform und wie wir dir helfen.</p>
                    </div>
                  </div>

                  {/* Bonus 2 - 5 Schritte */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="aspect-video bg-gray-900">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/c63a3f828d6c4fe189c14f16ddfa377a"
                        title="Die 5 wichtigsten Schritte"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">Bonus</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Die 5 wichtigsten Schritte</h3>
                      <p className="text-gray-600 text-sm">Kurzübersicht: Arbeitsvertrag → Wohnung → Anmeldung → Versicherung → Bank</p>
                    </div>
                  </div>

                  {/* Bonus 3 - Jobsuche Deep Dive */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="aspect-video bg-gray-900">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://app.heygen.com/embeds/7f65b41c236243bea279b93fd3623e90"
                        title="Jobsuche Deep Dive"
                        frameBorder="0"
                        allow="encrypted-media; fullscreen"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">Bonus</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">Jobsuche – Vertiefung</h3>
                      <p className="text-gray-600 text-sm">Erweiterte Tipps und Strategien für deine Jobsuche in der Schweiz.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Tip */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💡</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Tipp: Keine Vorlagen – du machst alles selbst!</h3>
                    <p className="text-gray-700">
                      Wir geben dir keine fertigen Vorlagen, sondern zeigen dir Schritt für Schritt, wie du alles selbst erledigst.
                      So verstehst du den Prozess wirklich und bist für alle Situationen gewappnet!
                    </p>
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
                  <h2 className="font-semibold text-gray-900 mb-4">Profil</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-swiss-red rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button className="text-swiss-red font-medium hover:underline">
                    Profil bearbeiten
                  </button>
                </div>

                <div className="p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Mitgliedschaft</h2>
                  <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Aktive Mitgliedschaft</p>
                        <p className="text-sm text-green-600">Mitglied seit {new Date(user.accessGrantedAt).toLocaleDateString('de-DE')}</p>
                      </div>
                    </div>
                  </div>
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
