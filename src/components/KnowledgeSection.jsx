import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Mountain,
  FileCheck,
  Users,
  CreditCard,
  Briefcase,
  FileText,
  Home,
  Car,
  Baby,
  Heart,
  ChevronRight,
  CheckCircle,
  MessageCircle,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Play,
  BookOpen,
  Target,
  Rocket,
  Shield,
  Wallet,
  Building2,
  GraduationCap
} from 'lucide-react';

// Journey Phases with grouped chapters
const journeyPhases = [
  {
    id: 'decision',
    phase: 1,
    title: 'Entscheidung',
    subtitle: 'Ist die Schweiz das Richtige für mich?',
    emoji: '🎯',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    chapters: [
      {
        id: 1,
        title: 'Warum in die Schweiz?',
        icon: Mountain,
        duration: '5 Min',
        summary: 'Stabilität, Wohlstand und Lebensqualität – warum die Schweiz das perfekte Ziel ist.',
        content: `Die Schweiz gehört zu den wenigen Ländern auf der Welt, in denen man als ganz normaler Arbeitnehmer finanziell frei werden kann. Während in vielen anderen Ländern trotz harter Arbeit am Monatsende kaum etwas übrig bleibt, ist in der Schweiz genau das Gegenteil möglich.

Wer motiviert, zuverlässig und zielgerichtet arbeitet, kann sich nicht nur ein gutes Leben leisten, sondern auch Rücklagen bilden, Eigentum erwerben und Träume verwirklichen.

**Was dich erwartet:**
• Höhere Löhne bei niedrigeren Steuern
• Atemberaubende Natur direkt vor der Tür
• Hohe Sicherheit und Lebensqualität
• Ein Land, das Eigenverantwortung belohnt

Die Schweiz steht für Perspektive, für Qualität, für Fairness.`
      },
      {
        id: 2,
        title: 'Voraussetzungen & Bewilligungen',
        icon: FileCheck,
        duration: '8 Min',
        summary: 'L, B, G, C – welche Bewilligung brauchst du?',
        content: `Der Weg in die Schweiz ist für EU-Bürger dank des Freizügigkeitsabkommens gut geregelt.

**Bewilligungsarten:**
• **L-Bewilligung:** Für vorübergehende Arbeit (unter einem Jahr)
• **B-Bewilligung:** Der Standard für EU-Auswanderer (5 Jahre, verlängerbar)
• **G-Bewilligung:** Grenzgänger (wohnen im Ausland, arbeiten in der Schweiz)
• **C-Bewilligung:** Niederlassungsbewilligung nach 5-10 Jahren

**Was du brauchst:**
1. Gültiger Arbeitsvertrag
2. Wohnsitz in der Schweiz
3. Krankenversicherung (innerhalb 3 Monaten)
4. Keine Vorstrafen`
      },
      {
        id: 3,
        title: 'Was verdient man wirklich?',
        icon: Wallet,
        duration: '6 Min',
        summary: 'Konkrete Beispielrechnungen für Einzelpersonen und Paare.',
        content: `**Beispiel: Max & Maria ziehen zusammen in die Schweiz**

Max (32, Sanitärinstallateur): CHF 6.500/Monat
Maria (30, Altenpflegerin): CHF 6.000/Monat
**Gesamt: CHF 12.500/Monat** + 13. Monatslohn!

**Monatliche Ausgaben:**
• Quellensteuer: ~CHF 1.500
• Krankenversicherung: ~CHF 700
• Miete (3-4 Zimmer): ~CHF 2.400
• Weitere Fixkosten: ~CHF 1.200

**Verfügbar: CHF 6.700/Monat**
**Mögliche Ersparnis: CHF 3.000-4.000/Monat!**

💡 In Kantonen wie Zug oder Schwyz zahlst du noch weniger Steuern.`
      },
      {
        id: 4,
        title: 'Steuern & Arbeitsbedingungen',
        icon: CreditCard,
        duration: '7 Min',
        summary: 'Quellensteuer, 3-Säulen-System und was anders ist.',
        content: `**Steuern:**
Als Ausländer zahlst du Quellensteuer – direkt vom Lohn abgezogen. Die Höhe variiert stark nach Kanton. In Zug oder Schwyz deutlich weniger als in Zürich.

**Arbeitsbedingungen:**
• Weniger Bürokratie, einfachere Verträge
• Kürzere Kündigungsfristen (7 Tage Probezeit)
• 4-5 Wochen Urlaub (statt 6 in DE)
• Mehr Eigenverantwortung

**3-Säulen-System:**
1. AHV (staatliche Rente)
2. Pensionskasse (vom Arbeitgeber)
3. Säule 3a (privates Sparen – steuerlich absetzbar!)

Fazit: Höhere Gehälter, weniger Bürokratie – wer die Regeln kennt, profitiert enorm.`
      }
    ]
  },
  {
    id: 'job',
    phase: 2,
    title: 'Jobsuche',
    subtitle: 'Den richtigen Job finden',
    emoji: '💼',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    chapters: [
      {
        id: 5,
        title: 'Jobsuche – So geht\'s',
        icon: Briefcase,
        duration: '6 Min',
        summary: 'Die wichtigsten Portale und wie die Community dir hilft.',
        content: `**Top Jobportale:**
• jobs.ch (die größte Jobbörse)
• indeed.ch
• LinkedIn
• jobup.ch (Romandie)

**Dein Vorteil als Mitglied:**
In unserer Community werden regelmäßig Jobtipps, offene Stellen und Erfahrungsberichte geteilt. Viele Jobs entstehen durch persönliche Empfehlungen!

**Tipps:**
• Veröffentliche ein Jobgesuch in der Community
• Nutze das Netzwerk für Empfehlungen
• Lass dir bei der Bewerbung helfen

Die Kombination aus Online-Suche und unserem Netzwerk erhöht deine Chancen enorm.`
      },
      {
        id: 6,
        title: 'Vertrag unterschrieben!',
        icon: FileText,
        duration: '5 Min',
        summary: 'Was jetzt zu tun ist: Kündigen, organisieren, vorbereiten.',
        content: `**Herzlichen Glückwunsch – du hast es geschafft!**

Mit dem Arbeitsvertrag hast du die wichtigste Voraussetzung. Jetzt geht's los:

**Nächste Schritte:**
1. Wohnungssuche starten
2. Arbeitsstelle kündigen (Fristen!)
3. Wohnung in DE/AT kündigen
4. Verträge kündigen (Internet, Versicherungen)
5. GEZ abmelden

**Unterlagen sammeln:**
• Reisepass
• Geburtsurkunde
• Arbeitsvertrag
• Führerschein

💡 Sammle alles in einem Ordner. In der Community findest du Checklisten!`
      }
    ]
  },
  {
    id: 'housing',
    phase: 3,
    title: 'Wohnung & Umzug',
    subtitle: 'Dein neues Zuhause finden',
    emoji: '🏠',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    chapters: [
      {
        id: 7,
        title: 'Wohnungssuche',
        icon: Home,
        duration: '7 Min',
        summary: 'Portale, WG-Tipps und Betrug vermeiden.',
        content: `**Die wichtigsten Portale:**
• immoscout24.ch
• homegate.ch
• newhome.ch
• wgzimmer.ch (für den Einstieg!)

**Tipp: Starte mit einer WG**
• Unkompliziert und schnell
• Keine volle Kaution nötig
• Du lernst Leute kennen
• Zeit zum Orientieren

**Achtung Betrug:**
• NIEMALS Geld vorab ohne Besichtigung!
• Kaution nur auf Sperrkonto

**Community-Vorteil:**
Mitglieder vor Ort machen dich auf Wohnungen aufmerksam!`
      },
      {
        id: 12,
        title: 'Umzug, Zoll & Auto',
        icon: Car,
        duration: '8 Min',
        summary: 'Formular 18.44, Führerschein umtauschen, Auto mitnehmen.',
        content: `**Umzugsgut verzollen (Formular 18.44):**
Gegenstände, die du mind. 6 Monate besitzt, sind zollfrei.

**Auto mitnehmen:**
1. Innerhalb 12 Monaten anmelden
2. Mit 18.44 verzollen
3. MFK (Schweizer TÜV)
4. Schweizer Kennzeichen holen

**Führerschein:**
• EU-Führerschein gilt 12 Monate
• Danach Umtausch (meist ohne Prüfung)
• Augenarztbescheinigung nötig

Das klingt kompliziert? Unsere Community hat das alles schon gemacht und hilft dir!`
      }
    ]
  },
  {
    id: 'official',
    phase: 4,
    title: 'Behörden & Anmeldung',
    subtitle: 'Offiziell ankommen',
    emoji: '📋',
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    chapters: [
      {
        id: 8,
        title: 'Anmeldung & Bewilligung',
        icon: Building2,
        duration: '6 Min',
        summary: 'Bei der Gemeinde anmelden – was du mitbringen musst.',
        content: `**Wichtig: Innerhalb 14 Tagen anmelden!**

Geh zur Einwohnerkontrolle deiner Gemeinde.

**Mitbringen:**
• Arbeitsvertrag
• Mietvertrag
• Reisepass/Ausweis
• Passfoto
• Krankenversicherungsnachweis

**Hinweise:**
• Krankenversicherung: 3 Monate Zeit
• Gebühren: 20-100 CHF je nach Kanton

Bei Fragen zum Behördendschungel: Die Community hilft!`
      },
      {
        id: 9,
        title: 'Familiennachzug',
        icon: Users,
        duration: '5 Min',
        summary: 'Partner und Kinder nachholen – so geht\'s.',
        content: `**Einzelperson:**
Mit Arbeitsvertrag → B-Bewilligung (5 Jahre)

**Familie nachholen:**
Zusätzliche Bedingungen:
• Einkommen reicht für alle
• Genügend große Wohnung
• Heiratsurkunde / Geburtsurkunden
• Krankenversicherung für alle

**Wichtig:**
Familiennachzug innerhalb 12 Monaten beantragen!

In der Community findest du Familien, die das bereits gemacht haben.`
      },
      {
        id: 10,
        title: 'Kinder, Schule & Kita',
        icon: GraduationCap,
        duration: '5 Min',
        summary: 'Bildungssystem und Kinderzulagen.',
        content: `**Schulpflicht:**
Ab 4-6 Jahren (kantonsabhängig). Öffentliche Schulen sind kostenlos!

**Kita-Plätze:**
• Frühzeitig anmelden (Wartelisten!)
• Kosten einkommensabhängig
• CHF 500-2.500/Monat

**Kinderzulage:**
• CHF 200-300 pro Kind/Monat
• Vom Arbeitgeber ausgezahlt
• Unabhängig vom Einkommen

Tipp: In der Community findest du Familien, die Kita- und Schul-Empfehlungen teilen.`
      }
    ]
  },
  {
    id: 'finance',
    phase: 5,
    title: 'Finanzen einrichten',
    subtitle: 'Bank, Versicherung & mehr',
    emoji: '💳',
    color: 'from-cyan-500 to-teal-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    chapters: [
      {
        id: 11,
        title: 'Bank & Versicherungen',
        icon: Shield,
        duration: '7 Min',
        summary: 'Konto eröffnen und Krankenversicherung wählen.',
        content: `**Bankkonto:**
Lohn kommt nur auf Schweizer Konto!

Beliebte Banken:
• UBS, Credit Suisse
• Kantonalbanken
• PostFinance (einfach online)

**Krankenversicherung (PFLICHT!):**
Innerhalb 3 Monaten abschließen.

• Grundversicherung: CHF 250-450/Monat
• Vergleiche auf comparis.ch oder priminfo.ch

Beliebte Anbieter: CSS, Helsana, Visana, Sanitas

💡 Die Community teilt Erfahrungen zu den besten Anbietern!`
      }
    ]
  },
  {
    id: 'arrived',
    phase: 6,
    title: 'Angekommen!',
    subtitle: 'Dein neues Leben beginnt',
    emoji: '🎉',
    color: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    chapters: [
      {
        id: 13,
        title: 'Willkommen in der Schweiz!',
        icon: Heart,
        duration: '4 Min',
        summary: 'Du hast es geschafft – Tipps für die ersten Wochen.',
        content: `**Du hast es wirklich geschafft!**

Nach all der Planung, dem Papierkram, den Entscheidungen und Zweifeln bist du nun angekommen: In der Schweiz. In deinem neuen Leben.

**Die ersten Wochen:**
Vieles ist neu: Sprache, Abläufe, Mentalität. Mit Geduld und Offenheit wirst du schnell Fuß fassen.

**Du bist nicht allein!**
Unsere Community steht dir auch nach dem Umzug zur Seite:
• Fragen zur Integration
• Tipps zum Einleben
• Netzwerk aufbauen
• Erfahrungen austauschen

Willkommen in der Schweiz – willkommen zuhause! 🇨🇭`
      }
    ]
  }
];

const KnowledgeSection = ({ setActiveTab }) => {
  const { user } = useAuth();
  const [activePhase, setActivePhase] = useState('decision');
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [completedChapters, setCompletedChapters] = useState([]);

  // Fortschritt aus Supabase laden (pro User)
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
          setCompletedChapters(data.map(row => row.item_id));
        }
      });
  }, [user?.id]);

  const currentPhase = journeyPhases.find(p => p.id === activePhase);
  const totalChapters = journeyPhases.reduce((acc, phase) => acc + phase.chapters.length, 0);
  const progress = Math.round((completedChapters.length / totalChapters) * 100);

  const markAsComplete = useCallback((chapterId) => {
    if (!user?.id || completedChapters.includes(chapterId)) return;

    setCompletedChapters(prev => [...prev, chapterId]);

    supabase
      .from('user_progress')
      .insert({ user_id: user.id, item_type: 'chapter', item_id: chapterId })
      .then(({ error }) => {
        if (error) console.error('Fortschritt speichern fehlgeschlagen:', error);
      });
  }, [user?.id, completedChapters]);

  return (
    <div className="space-y-8">
      {/* Header with Progress */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Title Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-swiss-red/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-3 py-1 text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Wissensbibliothek
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Deine Auswanderungs-
              <span className="text-swiss-red">Journey</span>
            </h1>
            <p className="text-gray-400 max-w-lg">
              Von der Entscheidung bis zum Ankommen – alles was du wissen musst,
              Schritt für Schritt erklärt. Mit Unterstützung der Community.
            </p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">Dein Fortschritt</span>
            <span className="text-2xl font-bold text-swiss-red">{progress}%</span>
          </div>

          {/* Circular Progress */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f3f4f6"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#DC2626"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${progress * 3.52} 352`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{completedChapters.length}</span>
              <span className="text-xs text-gray-500">von {totalChapters}</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            {completedChapters.length === 0
              ? 'Starte deine Journey!'
              : completedChapters.length === totalChapters
                ? 'Alle Kapitel abgeschlossen!'
                : 'Weiter so!'}
          </p>
        </div>
      </div>

      {/* Journey Roadmap - Horizontal */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {journeyPhases.map((phase, index) => {
            const isActive = activePhase === phase.id;
            const phaseCompleted = phase.chapters.every(c => completedChapters.includes(c.id));

            return (
              <div key={phase.id} className="flex items-center">
                <button
                  onClick={() => setActivePhase(phase.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${phase.color} text-white shadow-lg`
                      : phaseCompleted
                        ? 'bg-green-50 text-green-700 border-2 border-green-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-2xl">{phase.emoji}</span>
                  <div className="text-left">
                    <div className="text-xs opacity-75">Phase {phase.phase}</div>
                    <div className="font-semibold whitespace-nowrap">{phase.title}</div>
                  </div>
                  {phaseCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </button>
                {index < journeyPhases.length - 1 && (
                  <ChevronRight className={`w-5 h-5 mx-1 flex-shrink-0 ${
                    phaseCompleted ? 'text-green-400' : 'text-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Phase Content */}
      {currentPhase && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Phase Info Sidebar */}
          <div className="lg:col-span-4">
            <div className={`${currentPhase.bgColor} ${currentPhase.borderColor} border-2 rounded-[2rem] p-6 sticky top-24`}>
              <div className="text-5xl mb-4">{currentPhase.emoji}</div>
              <div className="text-sm font-medium text-gray-500 mb-1">Phase {currentPhase.phase}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentPhase.title}</h2>
              <p className="text-gray-600 mb-6">{currentPhase.subtitle}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                  </div>
                  <span>{currentPhase.chapters.length} Kapitel</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <span>~{currentPhase.chapters.reduce((acc, c) => acc + parseInt(c.duration), 0)} Min Lesezeit</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                  </div>
                  <span>
                    {currentPhase.chapters.filter(c => completedChapters.includes(c.id)).length} / {currentPhase.chapters.length} erledigt
                  </span>
                </div>
              </div>

              {/* Alpi Hint */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setActiveTab('community')}
                  className="w-full flex items-center gap-3 text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">🏔️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Fragen zu diesem Kapitel?</p>
                    <p className="text-xs text-swiss-red font-semibold group-hover:underline flex items-center gap-1">
                      Frag Alpi <ArrowRight className="w-3 h-3" />
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="lg:col-span-8 space-y-4">
            {currentPhase.chapters.map((chapter) => {
              const Icon = chapter.icon;
              const isExpanded = expandedChapter === chapter.id;
              const isCompleted = completedChapters.includes(chapter.id);

              return (
                <div
                  key={chapter.id}
                  className={`bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all ${
                    isExpanded ? `${currentPhase.borderColor}` : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => setExpandedChapter(isExpanded ? null : chapter.id)}
                    className="w-full p-5 flex items-start gap-4 text-left"
                  >
                    {/* Number/Check */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : `bg-gradient-to-br ${currentPhase.color} text-white`
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-bold ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
                          {chapter.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Gelesen
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{chapter.summary}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {chapter.duration}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      isExpanded ? 'rotate-90 text-swiss-red' : 'text-gray-300'
                    }`} />
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <div className="pt-5 pl-14">
                        <div className="prose prose-sm max-w-none text-gray-700">
                          {chapter.content.split('\n').map((paragraph, idx) => {
                            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                              return (
                                <h4 key={idx} className="font-bold text-gray-900 mt-4 mb-2 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-swiss-red" />
                                  {paragraph.replace(/\*\*/g, '')}
                                </h4>
                              );
                            }
                            if (paragraph.startsWith('•')) {
                              return (
                                <div key={idx} className="flex items-start gap-2 ml-2 mb-1">
                                  <span className="w-1.5 h-1.5 bg-swiss-red rounded-full mt-2 flex-shrink-0"></span>
                                  <span>{paragraph.substring(2)}</span>
                                </div>
                              );
                            }
                            if (paragraph.match(/^\d+\./)) {
                              return (
                                <div key={idx} className="flex items-start gap-2 ml-2 mb-1">
                                  <span className="w-5 h-5 bg-gray-100 rounded text-xs flex items-center justify-center font-semibold text-gray-600 flex-shrink-0">
                                    {paragraph.charAt(0)}
                                  </span>
                                  <span>{paragraph.substring(3)}</span>
                                </div>
                              );
                            }
                            if (paragraph.startsWith('💡')) {
                              return (
                                <div key={idx} className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4 flex items-start gap-3">
                                  <span className="text-xl">💡</span>
                                  <p className="text-amber-800 text-sm">{paragraph.substring(2)}</p>
                                </div>
                              );
                            }
                            return paragraph ? <p key={idx} className="mb-2">{paragraph}</p> : <br key={idx} />;
                          })}
                        </div>

                        {/* Actions */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <button
                            onClick={() => markAsComplete(chapter.id)}
                            disabled={isCompleted}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                              isCompleted
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : 'bg-swiss-red text-white hover:bg-swiss-red-dark'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {isCompleted ? 'Abgeschlossen' : 'Als gelesen markieren'}
                          </button>

                          <button
                            onClick={() => setActiveTab('community')}
                            className="text-gray-500 text-sm hover:text-swiss-red flex items-center gap-1"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Frage stellen
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Next Phase CTA */}
            {currentPhase.phase < journeyPhases.length && (
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nächste Phase</p>
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-xl">{journeyPhases[currentPhase.phase].emoji}</span>
                    {journeyPhases[currentPhase.phase].title}
                  </p>
                </div>
                <button
                  onClick={() => setActivePhase(journeyPhases[currentPhase.phase].id)}
                  className="bg-white shadow-sm border border-gray-200 px-4 py-2 rounded-xl font-medium text-gray-700 hover:border-swiss-red hover:text-swiss-red transition-colors flex items-center gap-2"
                >
                  Weiter <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alpi CTA Banner */}
      <button
        onClick={() => setActiveTab('community')}
        className="w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 flex items-center gap-4 text-left group hover:shadow-lg transition-shadow"
      >
        <div className="w-11 h-11 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-lg">🏔️</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm">Fragen zum Thema? Alpi erklärt dir alles Schritt für Schritt.</p>
          <p className="text-gray-400 text-xs mt-0.5">Alpi – Dein Auswanderer-Berater</p>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors flex-shrink-0" />
      </button>
    </div>
  );
};

export default KnowledgeSection;
