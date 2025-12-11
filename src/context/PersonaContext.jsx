import { createContext, useContext, useState, useEffect } from 'react';

const PersonaContext = createContext(null);

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

// Persona-spezifische Inhalte
export const personaContent = {
  einzelperson: {
    id: 'einzelperson',
    label: 'Einzelpersonen',
    shortLabel: 'Einzelperson',
    hero: {
      badge: 'Für Einzelpersonen',
      headline: 'Dein neues Leben in der Schweiz beginnt hier',
      subline: 'Starte deine Auswanderung mit professioneller Unterstützung, einem starken Netzwerk und allen Ressourcen, die du brauchst – für nur 249€ im Jahr statt tausende Euro für Agenturen.',
      bullets: [
        'Zugang zu exklusiver Jobplattform mit 500+ Schweizer Stellenangeboten',
        'Persönliche Beratung und Unterstützung bei jedem Schritt',
        'Vernetzung mit bereits erfolgreich ausgewanderten Mitgliedern',
        'Alle Dokumentenvorlagen für Behörden und Arbeitgeber'
      ]
    },
    features: {
      headline: 'Alles was Du für deine Auswanderung brauchst',
      items: [
        'Zugang zur exklusiven Schweizer Jobplattform mit über 500 Stellenangeboten',
        'Persönliche Beratung durch erfahrene Auswanderungsexperten',
        'Vollständige Dokumentenvorlagen für Behörden und Arbeitgeber',
        'Zertifiziertes Mitgliedschaftszertifikat für offizielle Verwendung',
        'Vernetzung mit bereits erfolgreich ausgewanderten Mitgliedern',
        'Detaillierte Checklisten für jeden Schritt deiner Auswanderung',
        'Wöchentliche Live-Webinare mit Experten aus der Schweiz',
        'Unterstützung bei Wohnungssuche und Behördenanmeldung',
        'Tipps zu Krankenversicherung, Steuern und Bankkonten',
        'Zugang zu allen Updates und neuen Features'
      ]
    },
    values: [
      {
        title: 'Jobplattform',
        description: 'Exklusiver Zugang zu über 500 Stellenangeboten von Schweizer Arbeitgebern, die internationale Fachkräfte suchen.'
      },
      {
        title: 'Netzwerk',
        description: 'Verbinde dich mit anderen Auswanderern und profitiere von deren Erfahrungen und Kontakten vor Ort.'
      },
      {
        title: 'Dokumentenvorlagen',
        description: 'Professionelle Vorlagen für Bewerbungen, Behördengänge und alle wichtigen Dokumente.'
      },
      {
        title: 'Persönlicher Support',
        description: 'Unser Expertenteam steht dir bei Fragen zur Seite – per E-Mail, Chat und in wöchentlichen Sprechstunden.'
      },
      {
        title: 'Webinare & Kurse',
        description: 'Regelmäßige Live-Webinare zu Jobsuche, Steuern, Krankenversicherung und Alltag in der Schweiz.'
      },
      {
        title: 'Arbeitgeber-Kontakte',
        description: 'Direkter Zugang zu Schweizer Unternehmen, die aktiv nach internationalen Fachkräften suchen.'
      }
    ],
    testimonial: {
      name: 'Michael Schneider',
      role: 'IT-Projektmanager in Zürich',
      text: 'Dank Deine Chance e.V. konnte ich meinen Traum vom Leben in der Schweiz verwirklichen. Das Team hat mich bei jedem Schritt unterstützt – von den Dokumenten bis zum Vorstellungsgespräch. Nach nur 3 Monaten hatte ich meinen Arbeitsvertrag in der Hand.',
      location: 'Vorher: Berlin, Deutschland'
    },
    cta: {
      headline: 'Starte jetzt dein neues Leben',
      subline: 'Werde Teil unserer Community und spare dir tausende Euro für teure Auswanderungsagenturen.'
    }
  },

  familie: {
    id: 'familie',
    label: 'Familien',
    shortLabel: 'Familie',
    hero: {
      badge: 'Für Familien',
      headline: 'Mit der ganzen Familie in die Schweiz auswandern',
      subline: 'Die Schweiz bietet eurer Familie beste Lebensqualität, exzellente Schulen und Sicherheit. Wir begleiten euch als Familie durch jeden Schritt – für nur 249€ im Jahr.',
      bullets: [
        'Beratung zu Schulen, Kitas und dem Schweizer Bildungssystem',
        'Unterstützung bei der Familienwohnungssuche',
        'Infos zu Familienversicherungen und Kinderzulagen',
        'Vernetzung mit anderen ausgewanderten Familien'
      ]
    },
    features: {
      headline: 'Alles was eure Familie für die Auswanderung braucht',
      items: [
        'Umfassende Beratung zum Schweizer Schul- und Bildungssystem',
        'Unterstützung bei der Suche nach familienfreundlichen Wohnungen',
        'Infos zu Kinderzulagen, Elternzeit und Familienleistungen',
        'Dokumentenvorlagen für die ganze Familie',
        'Vernetzung mit anderen ausgewanderten Familien',
        'Beratung zu Krankenversicherungen für Kinder und Partner',
        'Tipps zur Integration: Vereine, Spielgruppen, Nachbarschaft',
        'Webinare speziell für Familien mit Kindern',
        'Checkliste für den Familienumzug',
        'Zugang zu allen Updates und Community-Events'
      ]
    },
    values: [
      {
        title: 'Schulberatung',
        description: 'Umfassende Infos zum Schweizer Schulsystem, internationale Schulen und Anmeldeprozesse für eure Kinder.'
      },
      {
        title: 'Familien-Netzwerk',
        description: 'Verbinde dich mit anderen ausgewanderten Familien und tausche Erfahrungen über Kitas, Schulen und Freizeitangebote aus.'
      },
      {
        title: 'Wohnungssuche',
        description: 'Tipps und Unterstützung bei der Suche nach familienfreundlichen Wohnungen in guten Schulbezirken.'
      },
      {
        title: 'Familienleistungen',
        description: 'Beratung zu Kinderzulagen, Familienversicherungen und staatlichen Leistungen in der Schweiz.'
      },
      {
        title: 'Integration',
        description: 'Tipps für die Integration der ganzen Familie: Sportvereine, Spielgruppen und lokale Communities.'
      },
      {
        title: 'Doppelkarriere',
        description: 'Unterstützung für beide Partner bei der Jobsuche und Karriereplanung in der Schweiz.'
      }
    ],
    testimonial: {
      name: 'Familie Müller',
      role: 'Mit 2 Kindern nach Bern ausgewandert',
      text: 'Als Familie mit zwei Kindern war die Auswanderung eine große Entscheidung. Deine Chance hat uns bei allem geholfen – von der Schulanmeldung bis zur Wohnungssuche. Unsere Kinder haben sich schnell eingelebt und lieben ihr neues Zuhause.',
      location: 'Vorher: München, Deutschland'
    },
    cta: {
      headline: 'Startet euer Familienabenteuer',
      subline: 'Gebt eurer Familie die Chance auf ein neues Leben in einem der sichersten und lebenswertesten Länder der Welt.'
    }
  },

  selbststaendig: {
    id: 'selbststaendig',
    label: 'Selbstständige',
    shortLabel: 'Selbstständig',
    hero: {
      badge: 'Für Selbstständige & Freelancer',
      headline: 'Als Selbstständiger in die Schweiz – mehr verdienen, weniger Steuern',
      subline: 'Die Schweiz bietet Freelancern und Selbstständigen beste Bedingungen: niedrige Steuern, starke Wirtschaft und zahlungskräftige Kunden. Wir zeigen dir, wie es geht – für nur 249€ im Jahr.',
      bullets: [
        'Beratung zu Gewerbeanmeldung und Rechtsformen (Einzelfirma, GmbH)',
        'Steueroptimierung und Sozialversicherungspflichten',
        'Netzwerk zu Schweizer Kunden und Auftraggebern',
        'Buchhaltungsvorlagen und Rechnungsmuster auf Schweizerdeutsch'
      ]
    },
    features: {
      headline: 'Alles was du als Selbstständiger brauchst',
      items: [
        'Beratung zu allen Rechtsformen: Einzelfirma, GmbH, AG',
        'Infos zur Gewerbeanmeldung und Handelsregistereintrag',
        'Steueroptimierung: Wo in der Schweiz zahlt man am wenigsten?',
        'Sozialversicherung: AHV, Pensionskasse, Unfallversicherung',
        'Netzwerk zu potenziellen Schweizer Kunden',
        'Buchhaltungsvorlagen nach Schweizer Standards',
        'Rechnungsmuster mit korrekter MwSt.-Ausweisung',
        'Webinare zu Steuern, Versicherungen und Akquise',
        'Coworking-Spaces und Business-Communities',
        'Bankkonten für Selbstständige eröffnen'
      ]
    },
    values: [
      {
        title: 'Firmengründung',
        description: 'Schritt-für-Schritt Anleitung zur Gründung deiner Firma in der Schweiz – von der Einzelfirma bis zur GmbH.'
      },
      {
        title: 'Steueroptimierung',
        description: 'Erfahre, welche Kantone die niedrigsten Steuern haben und wie du legal Steuern sparst.'
      },
      {
        title: 'Kundenakquise',
        description: 'Zugang zu unserem Netzwerk von Schweizer Unternehmen, die Freelancer und Dienstleister suchen.'
      },
      {
        title: 'Buchhaltung',
        description: 'Vorlagen und Tools für deine Buchhaltung nach Schweizer Standards inkl. MwSt.-Abrechnung.'
      },
      {
        title: 'Versicherungen',
        description: 'Beratung zu allen Pflichtversicherungen für Selbstständige: AHV, BVG, Unfallversicherung.'
      },
      {
        title: 'Business-Netzwerk',
        description: 'Vernetze dich mit anderen Selbstständigen und finde Kooperationspartner in der Schweiz.'
      }
    ],
    testimonial: {
      name: 'Thomas Weber',
      role: 'Freelance Softwareentwickler in Zug',
      text: 'Als Freelancer war mir wichtig, die steuerlichen Vorteile der Schweiz optimal zu nutzen. Deine Chance hat mir gezeigt, wie ich meine Firma richtig aufsetze und wo ich am meisten spare. Mein Nettoeinkommen hat sich fast verdoppelt!',
      location: 'Vorher: Frankfurt, Deutschland'
    },
    cta: {
      headline: 'Maximiere dein Einkommen als Selbstständiger',
      subline: 'Nutze die Vorteile der Schweiz: niedrigere Steuern, starke Währung und zahlungskräftige Kunden.'
    }
  },

  unternehmer: {
    id: 'unternehmer',
    label: 'Unternehmer',
    shortLabel: 'Unternehmer',
    hero: {
      badge: 'Für Unternehmer & Gründer',
      headline: 'Dein Unternehmen in der Schweiz – dem Herzen Europas',
      subline: 'Politische Stabilität, niedrige Unternehmenssteuern und Zugang zu Top-Talenten: Die Schweiz ist der ideale Standort für dein Business. Wir begleiten dich – für nur 249€ im Jahr.',
      bullets: [
        'Beratung zu Firmenstrukturen: GmbH, AG, Holding',
        'Standortanalyse: Welcher Kanton passt zu deinem Business?',
        'Netzwerk zu Investoren, Banken und Geschäftspartnern',
        'Unterstützung bei Mitarbeiter-Relocation'
      ]
    },
    features: {
      headline: 'Alles was du als Unternehmer brauchst',
      items: [
        'Beratung zu optimalen Firmenstrukturen und Holdings',
        'Standortvergleich: Steuern, Infrastruktur, Talentpool pro Kanton',
        'Netzwerk zu Schweizer Banken und Investoren',
        'Unterstützung beim Aufbau eines Schweizer Teams',
        'Relocation-Support für deine Mitarbeiter',
        'Geschäftsadresse und virtuelle Büros',
        'Kontakte zu Anwälten, Treuhändern und Steuerberatern',
        'Webinare zu Unternehmensrecht und M&A',
        'Startup-Ökosystem und Förderprogramme',
        'Zugang zu exklusiven Unternehmer-Events'
      ]
    },
    values: [
      {
        title: 'Firmenstruktur',
        description: 'Beratung zur optimalen Rechtsform und Struktur – von der einfachen GmbH bis zur internationalen Holding.'
      },
      {
        title: 'Standortwahl',
        description: 'Detaillierte Analyse der Kantone: Steuersätze, Infrastruktur, Fachkräfte und Lebensqualität.'
      },
      {
        title: 'Investoren-Netzwerk',
        description: 'Zugang zu Schweizer Banken, VCs und Business Angels für deine Wachstumsfinanzierung.'
      },
      {
        title: 'Team-Aufbau',
        description: 'Unterstützung bei der Rekrutierung und Relocation von Mitarbeitern in die Schweiz.'
      },
      {
        title: 'Experten-Netzwerk',
        description: 'Kontakte zu spezialisierten Anwälten, Treuhändern und Steuerberatern für Unternehmer.'
      },
      {
        title: 'Unternehmer-Community',
        description: 'Exklusives Netzwerk von Unternehmern in der Schweiz für Austausch und Kooperationen.'
      }
    ],
    testimonial: {
      name: 'Dr. Sandra Klein',
      role: 'Gründerin eines Tech-Startups in Zürich',
      text: 'Die Verlagerung meines Unternehmens in die Schweiz war die beste Entscheidung. Deine Chance hat mir geholfen, den richtigen Kanton zu wählen und alle Formalitäten zu erledigen. Heute profitieren wir von niedrigen Steuern und Top-Talenten.',
      location: 'Vorher: Berlin, Deutschland'
    },
    cta: {
      headline: 'Bringe dein Unternehmen auf das nächste Level',
      subline: 'Die Schweiz bietet politische Stabilität, niedrige Steuern und Zugang zu den besten Talenten Europas.'
    }
  }
};

export const PersonaProvider = ({ children }) => {
  const [currentPersona, setCurrentPersona] = useState('einzelperson');

  // Persist persona selection
  useEffect(() => {
    const saved = localStorage.getItem('deinechance_persona');
    if (saved && personaContent[saved]) {
      setCurrentPersona(saved);
    }
  }, []);

  const switchPersona = (personaId) => {
    if (personaContent[personaId]) {
      setCurrentPersona(personaId);
      localStorage.setItem('deinechance_persona', personaId);
    }
  };

  const content = personaContent[currentPersona];

  const value = {
    currentPersona,
    switchPersona,
    content,
    allPersonas: Object.keys(personaContent).map(key => ({
      id: key,
      label: personaContent[key].label,
      shortLabel: personaContent[key].shortLabel
    }))
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

export default PersonaContext;
