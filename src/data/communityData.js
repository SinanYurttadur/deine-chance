// Community Channels / Räume
export const communityChannels = [
  {
    id: 'arbeitgeber-erfahrungen',
    name: 'Arbeitgeber-Erfahrungen',
    emoji: '🔧',
    description: 'Für Austausch über Firmen, Branchen & Bewerbungsprozesse',
    color: 'bg-blue-500',
    benefits: ['Community-Wissen sammeln', 'Unbezahlbar für Bewerber:innen'],
    format: '„Hat jemand bei XY gearbeitet?" – Tipps, Warnungen, Kontakte'
  },
  {
    id: 'netzwerk-und-events',
    name: 'Netzwerk & Events',
    emoji: '💬',
    description: 'Für lokale Treffen, digitale Meetups & Community-Formate',
    color: 'bg-green-500',
    benefits: ['Vertrauen & Zusammenhalt stärken', 'Chance für Peer-Beratung, Jobempfehlungen, WG-Suche'],
    format: '„Wer ist neu in Zürich?", „Kaffee & Kennenlernen Basel?"'
  },
  {
    id: 'weiterbildung-und-karriere',
    name: 'Weiterbildung & Karriere',
    emoji: '🧠',
    description: 'Alles rund um Kurse, Umschulungen, Berufseinstieg & Anerkennung',
    color: 'bg-purple-500',
    benefits: ['Besonders hilfreich für Quereinsteiger oder Neuanfang', 'Austausch über Sprachkurse, Diplomanerkennung, Schweizer Systeme'],
    format: 'Tipps zu RAV, edX, Migros Klubschule etc.'
  },
  {
    id: 'vorlagen-und-tools',
    name: 'Vorlagen & Tools',
    emoji: '🧾',
    description: 'Sammlung von PDFs, Checklisten, Bewerbungsmustern, Steuerhilfen',
    color: 'bg-orange-500',
    benefits: ['Zentrale Anlaufstelle für alles Praktische', 'Langfristig auffindbar & sauber strukturiert'],
    format: 'Downloads, Vorlagen, Checklisten'
  },
  {
    id: 'erfolge-und-meilensteine',
    name: 'Erfolge & Meilensteine',
    emoji: '❤️',
    description: 'Raum für emotionale Highlights & Motivation',
    color: 'bg-rose-500',
    benefits: ['Gemeinschaftsgefühl fördern', 'Gibt Mut & zeigt echte Fortschritte'],
    format: '„Ich hab den Job!", „Wir sind angekommen!", „Anmeldung geschafft!"'
  },
  {
    id: 'allgemein',
    name: 'Allgemeine Fragen',
    emoji: '💡',
    description: 'Für alle Fragen rund um die Auswanderung',
    color: 'bg-gray-500',
    benefits: ['Schnelle Hilfe von der Community', 'Keine Frage ist zu klein'],
    format: 'Offener Austausch zu allen Themen'
  }
];

// Vorlagen & Downloads
export const templates = {
  bewerbung: {
    title: 'Bewerbung & Jobsuche',
    emoji: '📄',
    items: [
      {
        id: 'lebenslauf-vorlage',
        name: 'Lebenslauf-Vorlage (Schweizer Format)',
        description: 'Professionelle CV-Vorlage nach Schweizer Standards',
        type: 'DOCX',
        downloads: 1847,
        content: `LEBENSLAUF

PERSÖNLICHE DATEN
Name: [Ihr Name]
Adresse: [Straße, PLZ Ort]
Telefon: [+41 XX XXX XX XX]
E-Mail: [ihre.email@beispiel.ch]
Geburtsdatum: [TT.MM.JJJJ]
Nationalität: [Ihre Nationalität]
Aufenthaltsstatus: [B-Bewilligung / C-Bewilligung]

BERUFSERFAHRUNG
[MM/JJJJ] – heute | [Jobtitel]
[Firmenname], [Ort]
• [Hauptaufgabe 1]
• [Hauptaufgabe 2]
• [Erfolg/Ergebnis]

[MM/JJJJ] – [MM/JJJJ] | [Jobtitel]
[Firmenname], [Ort]
• [Hauptaufgabe 1]
• [Hauptaufgabe 2]

AUSBILDUNG
[JJJJ] – [JJJJ] | [Abschluss]
[Institution], [Ort]

SPRACHEN
• Deutsch: [Muttersprache / C1 / B2]
• Englisch: [Niveau]
• Französisch: [Niveau]

FACHKENNTNISSE
• [Skill 1]
• [Skill 2]
• [Software/Tools]

REFERENZEN
Auf Anfrage verfügbar`
      },
      {
        id: 'motivationsschreiben',
        name: 'Motivationsschreiben Vorlage',
        description: 'Anschreiben-Muster für Schweizer Arbeitgeber',
        type: 'DOCX',
        downloads: 1523,
        content: `[Ihr Name]
[Ihre Adresse]
[PLZ Ort]
[Telefon]
[E-Mail]

[Firmenname]
[Abteilung / z.Hd. Herr/Frau Name]
[Adresse]
[PLZ Ort]

[Ort], [Datum]

Bewerbung als [Stellenbezeichnung] – Ihre Ausschreibung auf [Quelle]

Sehr geehrte Damen und Herren,

mit grossem Interesse habe ich Ihre Stellenausschreibung für die Position als [Jobtitel] gelesen. Die beschriebenen Aufgaben und Anforderungen entsprechen genau meinem beruflichen Profil und meinen Karrierezielen.

In meiner aktuellen Position als [aktuelle Position] bei [Firma] konnte ich bereits umfangreiche Erfahrungen in [relevanter Bereich] sammeln. Besonders [spezifische Erfahrung/Erfolg] hat mir gezeigt, dass ich [relevante Fähigkeit] erfolgreich einsetzen kann.

Was mich an [Firmenname] besonders anspricht, ist [konkreter Grund – z.B. Unternehmenskultur, Produkte, Innovation]. Ich bin überzeugt, dass ich mit meiner [Eigenschaft 1] und [Eigenschaft 2] einen wertvollen Beitrag zu Ihrem Team leisten kann.

Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr. Für Rückfragen stehe ich Ihnen jederzeit gerne zur Verfügung.

Freundliche Grüsse

[Ihr Name]

Beilagen:
• Lebenslauf
• Arbeitszeugnisse
• Diplome`
      },
      {
        id: 'bewerbungs-checkliste',
        name: 'Bewerbungs-Checkliste',
        description: 'Vollständige Checkliste für deine Bewerbung',
        type: 'PDF',
        downloads: 2341,
        content: `BEWERBUNGS-CHECKLISTE SCHWEIZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ VOR DER BEWERBUNG
  ☐ Stellenanzeige gründlich gelesen
  ☐ Firma recherchiert (Website, News, LinkedIn)
  ☐ Anforderungen mit eigenem Profil abgeglichen
  ☐ Ansprechpartner identifiziert

☐ UNTERLAGEN VORBEREITET
  ☐ Lebenslauf aktualisiert (Schweizer Format!)
  ☐ Foto professionell (optional, aber empfohlen)
  ☐ Motivationsschreiben individuell angepasst
  ☐ Arbeitszeugnisse vollständig
  ☐ Diplome/Zertifikate kopiert
  ☐ Referenzen vorbereitet (2-3 Personen)

☐ SCHWEIZ-SPEZIFISCH
  ☐ Aufenthaltsstatus erwähnt (B/C-Bewilligung)
  ☐ Sprachkenntnisse korrekt angegeben
  ☐ Schweizer Telefonnummer (+41)
  ☐ Gehaltsvorstellung recherchiert (Lohnrechner.ch)

☐ VERSAND
  ☐ Alle Dokumente als PDF gespeichert
  ☐ Dateinamen sinnvoll (Name_Lebenslauf.pdf)
  ☐ E-Mail professionell formuliert
  ☐ Betreff: Bewerbung als [Position] – [Ihr Name]
  ☐ Anhänge nicht grösser als 5 MB

☐ NACH DER BEWERBUNG
  ☐ Bewerbung in Liste notiert (Datum, Firma, Status)
  ☐ Nach 2 Wochen: Freundliche Nachfrage
  ☐ Interview-Vorbereitung starten`
      },
      {
        id: 'interview-fragen',
        name: 'Interview-Vorbereitung: Fragenliste',
        description: 'Typische Fragen in Schweizer Vorstellungsgesprächen',
        type: 'PDF',
        downloads: 1876,
        content: `INTERVIEW-VORBEREITUNG SCHWEIZ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TYPISCHE FRAGEN (bereite Antworten vor!)

1. ÜBER DICH
• Erzählen Sie uns etwas über sich.
• Was sind Ihre Stärken und Schwächen?
• Wo sehen Sie sich in 5 Jahren?
• Warum möchten Sie in der Schweiz arbeiten?

2. ZUR STELLE
• Warum interessiert Sie diese Position?
• Was wissen Sie über unser Unternehmen?
• Was können Sie zu unserem Team beitragen?
• Wie gehen Sie mit [stellenspezifische Situation] um?

3. ERFAHRUNG
• Beschreiben Sie ein erfolgreiches Projekt.
• Wie haben Sie einen Konflikt im Team gelöst?
• Erzählen Sie von einer Herausforderung und wie Sie sie gemeistert haben.

4. SCHWEIZ-SPEZIFISCH
• Wie ist Ihr Aufenthaltsstatus? (Ehrlich antworten!)
• Ab wann könnten Sie starten?
• Sind Sie bereit, Schweizerdeutsch zu lernen?
• Wie stellen Sie sich die Eingewöhnung vor?

5. GEHALT & KONDITIONEN
• Was sind Ihre Gehaltsvorstellungen?
  → Recherchiere vorher auf lohnrechner.ch!
  → Nenne eine Spanne, kein fixes Gehalt
• Wie flexibel sind Sie beim Arbeitsort?

DEINE FRAGEN AN DEN ARBEITGEBER
• Wie sieht ein typischer Arbeitstag aus?
• Wie ist das Team aufgestellt?
• Welche Entwicklungsmöglichkeiten gibt es?
• Wie läuft die Einarbeitung ab?
• Wann kann ich mit einer Rückmeldung rechnen?

TIPPS
✓ Pünktlich sein (5-10 Min. vorher)
✓ Höfliche Begrüssung (Händedruck, Blickkontakt)
✓ Schweizerisch: "Grüezi" / "Freundliche Grüsse"
✓ Kleiderordnung: Eher overdressed als underdressed
✓ Notizen machen ist erlaubt und zeigt Interesse`
      }
    ]
  },
  wohnung: {
    title: 'Wohnung & Umzug',
    emoji: '🏠',
    items: [
      {
        id: 'umzug-checkliste',
        name: 'Checkliste Umzug in die Schweiz',
        description: 'Alle Schritte vor, während und nach dem Umzug',
        type: 'PDF',
        downloads: 3421,
        content: `UMZUG IN DIE SCHWEIZ – VOLLSTÄNDIGE CHECKLISTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

☐ VOR DEM UMZUG (4-8 Wochen vorher)

  ARBEIT & AUFENTHALT
  ☐ Arbeitsvertrag unterschrieben
  ☐ Startdatum bestätigt
  ☐ Aufenthaltsbewilligung geklärt (L/B)

  WOHNUNG
  ☐ Wohnung in der Schweiz gefunden
  ☐ Mietvertrag unterschrieben
  ☐ Kaution überwiesen (Mietkautionskonto)
  ☐ Alte Wohnung gekündigt (Kündigungsfrist!)

  BEHÖRDEN DEUTSCHLAND/ÖSTERREICH
  ☐ Arbeitgeber gekündigt
  ☐ Abmeldung beim Einwohnermeldeamt
  ☐ Krankenkasse gekündigt
  ☐ GEZ/Rundfunkbeitrag abgemeldet
  ☐ Umzugsmitteilung bei der Post
  ☐ Bankkonto: Auslandsüberweisung möglich?

  VERSICHERUNGEN KÜNDIGEN
  ☐ Haftpflichtversicherung
  ☐ Hausratversicherung
  ☐ KFZ-Versicherung (falls Auto)
  ☐ Weitere Verträge (Handy, Internet etc.)

☐ ZOLL & UMZUGSGUT
  ☐ Formular 18.44 ausgefüllt
  ☐ Inventarliste erstellt (alle Gegenstände!)
  ☐ Umzugsunternehmen beauftragt ODER
  ☐ Selbst: Transporter gemietet
  ☐ Termin am Zoll vereinbart

☐ ERSTE WOCHE IN DER SCHWEIZ

  ANMELDUNG (innerhalb 14 Tagen!)
  ☐ Gemeinde/Einwohnerkontrolle aufgesucht
  ☐ Mitgebracht: Pass, Arbeitsvertrag, Mietvertrag, Passfoto
  ☐ Aufenthaltsbewilligung beantragt

  KRANKENVERSICHERUNG (innerhalb 3 Monaten)
  ☐ Krankenkasse verglichen (comparis.ch)
  ☐ Grundversicherung abgeschlossen
  ☐ Zusatzversicherung? (optional)

  BANKKONTO
  ☐ Schweizer Bank gewählt
  ☐ Konto eröffnet
  ☐ Lohnkonto dem Arbeitgeber mitgeteilt

☐ WEITERE SCHRITTE
  ☐ Führerschein umtauschen (innerhalb 12 Monate)
  ☐ Auto ummelden (falls mitgebracht)
  ☐ AHV-Nummer erhalten
  ☐ Steuererklärung vorbereiten (Quellensteuer)

GESCHAFFT! Willkommen in der Schweiz! 🇨🇭`
      },
      {
        id: 'mietanfrage-vorlage',
        name: 'Vorlage Mietanfrage (Mail/Text)',
        description: 'Professionelle Anfrage für Wohnungsbesichtigung',
        type: 'DOCX',
        downloads: 2156,
        content: `BETREFF: Anfrage Wohnungsbesichtigung – [Adresse / Objekt-Nr.]

Guten Tag

Mit grossem Interesse habe ich Ihr Inserat für die [X]-Zimmer-Wohnung an der [Strasse] in [Ort] auf [immoscout24.ch / homegate.ch] gesehen.

Zu meiner Person:
• Name: [Ihr vollständiger Name]
• Alter: [XX] Jahre
• Beruf: [Ihre Berufsbezeichnung]
• Arbeitgeber: [Firmenname], [Ort]
• Arbeitspensum: [100% / XX%], unbefristet
• Einkommen: CHF [Bruttolohn] pro Monat
• Aufenthaltsstatus: [B-Bewilligung / C-Bewilligung]

Ich suche eine Wohnung per [Einzugsdatum] und würde mich sehr über eine Besichtigungsmöglichkeit freuen.

Bei Interesse sende ich Ihnen gerne meine vollständigen Bewerbungsunterlagen zu:
• Betreibungsauszug
• Kopie Arbeitsvertrag
• Kopie Aufenthaltsbewilligung

Für Rückfragen erreichen Sie mich jederzeit unter:
• Telefon: [+41 XX XXX XX XX]
• E-Mail: [ihre.email@beispiel.ch]

Ich freue mich auf Ihre Rückmeldung.

Freundliche Grüsse
[Ihr Name]

---

TIPPS FÜR DIE WOHNUNGSBEWERBUNG:

1. SCHNELL SEIN – Reagiere innerhalb weniger Stunden auf neue Inserate
2. VOLLSTÄNDIG – Betreibungsauszug ist in der Schweiz Standard!
3. HÖFLICH – "Freundliche Grüsse" statt "MfG"
4. ERREICHBAR – Schweizer Handynummer ist ein Plus
5. FLEXIBEL – Biete mehrere Besichtigungstermine an`
      },
      {
        id: 'zoll-anleitung',
        name: 'Zollformular 18.44 – Anleitung',
        description: 'Schritt-für-Schritt Anleitung für die Zollanmeldung',
        type: 'PDF',
        downloads: 1654,
        content: `ZOLLANMELDUNG UMZUGSGUT – FORMULAR 18.44
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WAS IST DAS FORMULAR 18.44?
Das offizielle Schweizer Zollformular für die Einfuhr von Übersiedlungsgut (Umzugsgut) ohne Zollgebühren.

VORAUSSETZUNGEN FÜR ZOLLFREIE EINFUHR:
✓ Du verlegst deinen Wohnsitz in die Schweiz
✓ Die Gegenstände wurden mind. 6 Monate vor Umzug benutzt
✓ Du wirst die Gegenstände selbst weiter nutzen

WO BEKOMME ICH DAS FORMULAR?
→ Online: www.bazg.admin.ch
→ Suche: "Formular 18.44" oder "Übersiedlungsgut"

SO FÜLLST DU ES AUS:

1. PERSÖNLICHE ANGABEN
   • Name, Geburtsdatum, Nationalität
   • Bisherige Adresse (Deutschland/Österreich)
   • Neue Adresse in der Schweiz
   • Grund der Übersiedlung (Arbeit)

2. INVENTARLISTE (WICHTIG!)
   Erstelle eine detaillierte Liste aller Gegenstände:

   Beispiel:
   | Anzahl | Gegenstand          | Wert (ca.) |
   |--------|---------------------|------------|
   | 1      | Sofa, grau, IKEA    | 500 EUR    |
   | 1      | Fernseher Samsung   | 400 EUR    |
   | 2      | Fahrräder           | 600 EUR    |
   | 20     | Umzugskartons Bücher| 200 EUR    |
   | 1      | PKW VW Golf, 2019   | 15.000 EUR |

3. EINREICHUNG
   • Formular ausdrucken und unterschreiben
   • Bei Grenzübertritt dem Zoll vorlegen
   • ODER: Spedition übernimmt die Abwicklung

WICHTIGE HINWEISE:
⚠️ Neuware (mit Originalverpackung) kann verzollt werden!
⚠️ Alkohol & Tabak haben separate Freigrenzen
⚠️ Haustiere brauchen EU-Heimtierausweis + Tollwutimpfung

AUTO EINFÜHREN:
• Mit Formular 18.44 anmelden
• Innerhalb 12 Monate: Schweizer Nummern beantragen
• MFK (Motorfahrzeugkontrolle) = TÜV-Prüfung

ZOLLSTELLEN:
Bei Fragen: Bundesamt für Zoll (BAZG)
Telefon: +41 58 467 15 15
Web: www.bazg.admin.ch`
      },
      {
        id: 'uebergabeprotokoll',
        name: 'Wohnungsübergabe-Protokoll',
        description: 'Vorlage für die Wohnungsübergabe in der Schweiz',
        type: 'PDF',
        downloads: 987,
        content: `WOHNUNGSÜBERGABE-PROTOKOLL
━━━━━━━━━━━━━━━━━━━━━━━━━━━

OBJEKT
Adresse: ________________________________
PLZ/Ort: ________________________________
Wohnung: _____ Zimmer, _____ m²

PARTEIEN
Vermieter/Verwaltung: ________________________________
Mieter (alt): ________________________________
Mieter (neu): ________________________________

ÜBERGABE
Datum: ________________________________
Uhrzeit: ________________________________

ZÄHLERSTÄNDE
Strom: _____________ kWh
Wasser: _____________ m³
Heizung: _____________

SCHLÜSSEL
☐ Hausschlüssel: _____ Stück
☐ Wohnungsschlüssel: _____ Stück
☐ Briefkastenschlüssel: _____ Stück
☐ Kellerschlüssel: _____ Stück
☐ Waschküchenschlüssel: _____ Stück
☐ Sonstige: ________________________________

ZUSTAND DER RÄUME

EINGANG/FLUR
☐ Wände: ________________________________
☐ Boden: ________________________________
☐ Türen: ________________________________
☐ Sonstiges: ________________________________

WOHNZIMMER
☐ Wände: ________________________________
☐ Boden: ________________________________
☐ Fenster: ________________________________
☐ Sonstiges: ________________________________

KÜCHE
☐ Wände: ________________________________
☐ Boden: ________________________________
☐ Geräte (Herd, Kühlschrank etc.): ________________________________
☐ Sonstiges: ________________________________

BADEZIMMER
☐ Wände/Fliesen: ________________________________
☐ Sanitäranlagen: ________________________________
☐ Sonstiges: ________________________________

SCHLAFZIMMER
☐ Wände: ________________________________
☐ Boden: ________________________________
☐ Sonstiges: ________________________________

BALKON/TERRASSE
☐ Zustand: ________________________________

KELLER/ABSTELLRAUM
☐ Zustand: ________________________________

MÄNGEL / BEMERKUNGEN
________________________________________________
________________________________________________
________________________________________________

VEREINBARUNGEN
________________________________________________
________________________________________________

UNTERSCHRIFTEN

Vermieter/Verwaltung: _________________ Datum: _________

Mieter (alt): _________________ Datum: _________

Mieter (neu): _________________ Datum: _________`
      }
    ]
  },
  steuern: {
    title: 'Steuern & Abgaben',
    emoji: '🧾',
    items: [
      {
        id: 'quellensteuer-erklaert',
        name: 'Quellensteuer erklärt',
        description: 'Alles was du über die Quellensteuer wissen musst',
        type: 'PDF',
        downloads: 2876,
        content: `QUELLENSTEUER IN DER SCHWEIZ – KOMPAKT ERKLÄRT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WAS IST DIE QUELLENSTEUER?
Die Quellensteuer ist eine Einkommenssteuer für ausländische Arbeitnehmer ohne C-Bewilligung. Sie wird direkt vom Arbeitgeber vom Lohn abgezogen und an das Steueramt überwiesen.

WER ZAHLT QUELLENSTEUER?
• Ausländer mit L- oder B-Bewilligung
• Grenzgänger (G-Bewilligung)
• Kurzaufenthalter

WIE HOCH IST DIE QUELLENSTEUER?
Die Höhe variiert stark nach:
• Kanton (Zug niedrig, Genf hoch)
• Einkommen
• Zivilstand (ledig, verheiratet)
• Anzahl Kinder
• Konfession

BEISPIELRECHNUNG (Kanton Zürich, 2024):
Bruttolohn: CHF 6'500/Monat
Ledig, keine Kinder, keine Konfession
→ Quellensteuer ca. CHF 700-900/Monat (11-14%)

TARIFCODES (wichtig!):
A = Alleinstehend ohne Kinder
B = Verheiratet, Partner nicht erwerbstätig
C = Verheiratet, Partner erwerbstätig
D-P = Weitere Spezialfälle

KIRCHENSTEUER?
• Wenn du einer Landeskirche angehörst (röm.-kath., ev.-ref.)
• Austritt möglich → niedrigerer Tarif
• Bei der Gemeinde anmelden: "Konfessionslos"

NACHTRÄGLICHE ORDENTLICHE VERANLAGUNG (NOV):
Ab CHF 120'000 Bruttolohn/Jahr (oder auf Antrag):
• Du machst eine normale Steuererklärung
• Quellensteuer wird angerechnet
• Abzüge möglich (Berufskosten, 3a, Weiterbildung)

TIPPS ZUM SPAREN:
1. Säule 3a einzahlen (bis CHF 7'056/Jahr)
2. Weiterbildungskosten absetzen
3. Berufsauslagen geltend machen
4. Richtigen Kanton wählen (wenn flexibel)

STEUERKANTONE IM VERGLEICH (Einzelperson, CHF 80'000):
• Zug: ~8%
• Schwyz: ~9%
• Nidwalden: ~9.5%
• Zürich: ~11%
• Bern: ~13%
• Genf: ~15%

WICHTIGE LINKS:
• Quellensteuerrechner: www.tax.admin.ch
• Kantonsvergleich: www.comparis.ch/steuern`
      },
      {
        id: 'einkommens-rechner',
        name: 'Einkommens-Rechner (Excel)',
        description: 'Berechne dein Netto-Einkommen in der Schweiz',
        type: 'XLSX',
        downloads: 3254,
        content: `EINKOMMENS-RECHNER SCHWEIZ
━━━━━━━━━━━━━━━━━━━━━━━━━━

ANLEITUNG: Fülle die gelben Felder aus!

═══════════════════════════════════════════
BRUTTO-EINKOMMEN
═══════════════════════════════════════════
Monatslohn brutto:          CHF _________
Anzahl Monatslöhne:         _____ (meist 12 oder 13)
Jahresbrutto:               CHF _________

═══════════════════════════════════════════
OBLIGATORISCHE ABZÜGE (vom Brutto)
═══════════════════════════════════════════
AHV/IV/EO (5.3%):           CHF _________
ALV (1.1%):                 CHF _________
NBU (ca. 0.5-2%):           CHF _________
Pensionskasse (ca. 7-10%):  CHF _________
─────────────────────────────────────────────
Total Sozialabzüge:         CHF _________

═══════════════════════════════════════════
STEUERN
═══════════════════════════════════════════
Quellensteuer (ca. 10-15%): CHF _________
ODER Einkommenssteuer:      CHF _________
─────────────────────────────────────────────
Total Steuern:              CHF _________

═══════════════════════════════════════════
NETTO-EINKOMMEN
═══════════════════════════════════════════
Netto pro Monat:            CHF _________
Netto pro Jahr:             CHF _________

═══════════════════════════════════════════
FIXKOSTEN (Richtwerte)
═══════════════════════════════════════════
Miete (Ø Schweiz):          CHF 1'500-2'500
Krankenkasse:               CHF 300-450
Lebensmittel:               CHF 400-600
ÖV / Auto:                  CHF 200-500
Handy/Internet:             CHF 100-150
Haftpflicht/Hausrat:        CHF 30-50
─────────────────────────────────────────────
Total Fixkosten ca.:        CHF 2'530-4'250

═══════════════════════════════════════════
FREI VERFÜGBAR
═══════════════════════════════════════════
Netto - Fixkosten:          CHF _________

DAVON SPAREN:
Säule 3a (max):             CHF 588/Monat
Sparziel:                   CHF _________

═══════════════════════════════════════════

ONLINE-RECHNER:
• Brutto/Netto: www.lohncomputer.ch
• Steuern: www.comparis.ch/steuern
• Lebenskosten: www.numbeo.com`
      },
      {
        id: 'saeule-3a-vergleich',
        name: 'Säule 3a Vergleich',
        description: 'Die besten 3a-Anbieter im Vergleich',
        type: 'PDF',
        downloads: 1987,
        content: `SÄULE 3A – VERGLEICH DER BESTEN ANBIETER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WAS IST DIE SÄULE 3A?
Freiwillige, steuerbegünstigte Altersvorsorge. Einzahlungen können vom steuerbaren Einkommen abgezogen werden!

MAXIMALBETRAG 2024:
• Mit Pensionskasse: CHF 7'056/Jahr
• Ohne Pensionskasse: CHF 35'280/Jahr (20% des Einkommens)

WARUM LOHNT SICH DAS?
Beispiel: CHF 7'000 einzahlen bei 30% Grenzsteuersatz
→ Steuerersparnis: CHF 2'100 pro Jahr!

═══════════════════════════════════════════
TOP 3A-ANBIETER (Digital/Günstig)
═══════════════════════════════════════════

1. FINPENSION
   Kosten: 0.39% p.a. (All-in)
   Min. Einzahlung: CHF 1
   Aktienanteil: bis 99%
   App: Ja
   ★★★★★ Empfehlung!
   → www.finpension.ch

2. VIAC (by Terzo)
   Kosten: 0.44% p.a. (Fonds) + 0.00% (Konto)
   Min. Einzahlung: CHF 1
   Aktienanteil: bis 97%
   App: Ja
   ★★★★★
   → www.viac.ch

3. FRANKLY (by ZKB)
   Kosten: 0.45% p.a.
   Min. Einzahlung: CHF 1
   Aktienanteil: bis 95%
   App: Ja
   ★★★★☆
   → www.frankly.ch

═══════════════════════════════════════════
KLASSISCHE BANKEN (teurer)
═══════════════════════════════════════════

• UBS Vitainvest: 1.1-1.5% p.a.
• Credit Suisse: 1.0-1.4% p.a.
• Raiffeisen: 0.8-1.2% p.a.

→ Nicht empfohlen wegen hoher Gebühren!

═══════════════════════════════════════════
STRATEGIE-TIPPS
═══════════════════════════════════════════

JUNGES ALTER (unter 40):
• Hoher Aktienanteil (80-99%)
• Langfristiger Horizont = höhere Rendite

MITTLERES ALTER (40-55):
• Gemischte Strategie (50-70% Aktien)
• Risiko langsam reduzieren

KURZ VOR PENSION (55+):
• Konservativ (30-50% Aktien)
• Sicherheit priorisieren

═══════════════════════════════════════════
SO ERÖFFNEST DU EIN 3A-KONTO
═══════════════════════════════════════════

1. Anbieter wählen (Empfehlung: Finpension oder VIAC)
2. Online registrieren (10 Min.)
3. ID hochladen (Verifizierung)
4. Strategie wählen (Aktienanteil)
5. Dauerauftrag einrichten
6. Fertig! Steuerersparnis geniessen!

TIPP: Einzahlung bis 31.12. für Steuerabzug im selben Jahr!`
      }
    ]
  },
  familie: {
    title: 'Familiennachzug & Behörden',
    emoji: '👨‍👩‍👧',
    items: [
      {
        id: 'familiennachzug-checkliste',
        name: 'Checkliste Familiennachzug',
        description: 'Alle Dokumente und Schritte für den Familiennachzug',
        type: 'PDF',
        downloads: 1543,
        content: `FAMILIENNACHZUG IN DIE SCHWEIZ – CHECKLISTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VORAUSSETZUNGEN:
☐ Du hast eine B- oder C-Bewilligung
☐ Du verdienst genug für die ganze Familie (ohne Sozialhilfe)
☐ Du hast eine ausreichend grosse Wohnung
☐ Nachzug innerhalb 12 Monate nach deiner Einreise

═══════════════════════════════════════════
BENÖTIGTE DOKUMENTE
═══════════════════════════════════════════

VON DIR (bereits in der Schweiz):
☐ Kopie Aufenthaltsbewilligung
☐ Arbeitsvertrag
☐ Lohnabrechnungen (letzte 3 Monate)
☐ Mietvertrag (zeigt Wohnungsgrösse)
☐ Nachweis Krankenversicherung

VON EHEPARTNER/IN:
☐ Gültiger Reisepass (Kopie)
☐ Passfoto (biometrisch)
☐ Heiratsurkunde (original + beglaubigte Übersetzung)
☐ Geburtsurkunde

VON KINDERN (unter 18):
☐ Gültiger Reisepass (Kopie)
☐ Passfoto (biometrisch)
☐ Geburtsurkunde (original + beglaubigte Übersetzung)
☐ Schulzeugnisse (für Schulanmeldung)

═══════════════════════════════════════════
ABLAUF SCHRITT FÜR SCHRITT
═══════════════════════════════════════════

1. ANTRAG STELLEN
   ☐ Gesuch beim Migrationsamt deines Kantons
   ☐ Online oder persönlich (je nach Kanton)
   ☐ Alle Dokumente beifügen
   ☐ Gebühr bezahlen (ca. CHF 100-200)

2. BEARBEITUNG (4-12 Wochen)
   ☐ Migrationsamt prüft Unterlagen
   ☐ Ev. Nachforderung von Dokumenten
   ☐ Genehmigung per Post

3. EINREISE DER FAMILIE
   ☐ Mit Genehmigung + Dokumenten einreisen
   ☐ Innerhalb 14 Tagen bei Gemeinde anmelden
   ☐ Aufenthaltsbewilligung beantragen

4. NACH DER EINREISE
   ☐ Krankenversicherung für alle (3 Monate Frist)
   ☐ Kinder in Schule/Kita anmelden
   ☐ Kinderzulagen beantragen

═══════════════════════════════════════════
WOHNUNGSGRÖSSE (Richtwerte)
═══════════════════════════════════════════
• 2 Personen: mind. 2.5 Zimmer
• 3 Personen: mind. 3.5 Zimmer
• 4 Personen: mind. 4 Zimmer
• Pro weitere Person: +0.5-1 Zimmer

═══════════════════════════════════════════
ÜBERSETZUNGEN
═══════════════════════════════════════════
Dokumente müssen übersetzt sein in:
• Deutsch (Deutschschweiz)
• Französisch (Romandie)
• Italienisch (Tessin)

Anerkannte Übersetzer:
• uebersetzer.ch
• lingoking.de
• Konsulat anfragen

WICHTIG: "Beglaubigte Übersetzung" = von anerkanntem Übersetzer mit Stempel!`
      },
      {
        id: 'schulanmeldung-kita',
        name: 'Schulanmeldung & Kita-Checkliste',
        description: 'Kinder in Schule oder Kita anmelden',
        type: 'PDF',
        downloads: 876,
        content: `KINDER IN DER SCHWEIZ – SCHULE & KITA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

═══════════════════════════════════════════
OBLIGATORISCHE SCHULPFLICHT
═══════════════════════════════════════════

• Beginn: Ab 4 Jahren (Kindergarten)
• Dauer: 11 Jahre (2 Jahre Kiga + 9 Jahre Schule)
• Kostenlos: Ja, öffentliche Schulen sind gratis!

ABLAUF:
1. Bei der Gemeinde anmelden (mit Kind)
2. Gemeinde teilt automatisch Schule zu
3. Brief mit Schulzuweisung kommt per Post
4. Bei der Schule melden → fertig!

═══════════════════════════════════════════
KITA (KINDERTAGESSTÄTTE) – unter 4 Jahre
═══════════════════════════════════════════

WICHTIG: Frühzeitig anmelden! Wartelisten!

KOSTEN:
• Abhängig vom Einkommen (subventioniert)
• Vollzeit: CHF 1'500-2'500/Monat (ohne Subvention)
• Mit Subvention: CHF 500-1'500/Monat

CHECKLISTE ANMELDUNG:
☐ Kita in der Nähe suchen (Google: "Kita [Ort]")
☐ Mehrere Kitas kontaktieren (Wartelisten!)
☐ Besichtigung vereinbaren
☐ Anmeldeformular ausfüllen
☐ Einkommensnachweis für Subvention

ALTERNATIVE: TAGESFAMILIE
• Betreuung bei einer Tagesmutter
• Flexibler als Kita
• Kosten ähnlich oder günstiger
→ Suche: kibesuisse.ch

═══════════════════════════════════════════
SCHULANMELDUNG – CHECKLISTE
═══════════════════════════════════════════

BENÖTIGTE DOKUMENTE:
☐ Anmeldebestätigung der Gemeinde
☐ Geburtsurkunde des Kindes
☐ Impfausweis (empfohlen, nicht Pflicht)
☐ Letzte Schulzeugnisse (aus Heimatland)
☐ Pass/Ausweis des Kindes

FÜR ÄLTERE KINDER:
☐ Zeugnisse übersetzen lassen
☐ Einstufungstest möglich
☐ Ev. Intensiv-Deutschkurs zuerst

═══════════════════════════════════════════
KINDERZULAGEN (KINDERGELD)
═══════════════════════════════════════════

HÖHE (je nach Kanton):
• Pro Kind: CHF 200-300/Monat
• Ausbildungszulage (ab 16): CHF 250-350/Monat

WIE BEANTRAGEN?
1. Antrag beim Arbeitgeber stellen
2. Arbeitgeber leitet an Ausgleichskasse weiter
3. Auszahlung erfolgt mit dem Lohn

BENÖTIGTE UNTERLAGEN:
☐ Geburtsurkunde Kind
☐ Aufenthaltsbewilligung Kind
☐ Wohnsitzbestätigung

═══════════════════════════════════════════
SPRACHFÖRDERUNG
═══════════════════════════════════════════

Kostenlose Angebote:
• DaZ (Deutsch als Zweitsprache) in der Schule
• Spielgruppen für Kleinkinder
• Bibliothek: Kinderbücher, Vorlesen

Kostenpflichtig:
• Migros Klubschule: Kinder-Deutschkurse
• Private Sprachschulen`
      }
    ]
  }
};

// Nützliche Links
export const usefulLinks = [
  { category: 'Jobportale', links: [
    { name: 'jobs.ch', url: 'https://www.jobs.ch', description: 'Grösste Jobbörse der Schweiz' },
    { name: 'jobup.ch', url: 'https://www.jobup.ch', description: 'Jobs in der Romandie' },
    { name: 'indeed.ch', url: 'https://www.indeed.ch', description: 'Internationale Jobbörse' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com', description: 'Business-Netzwerk' }
  ]},
  { category: 'Versicherungen', links: [
    { name: 'comparis.ch', url: 'https://www.comparis.ch', description: 'Versicherungsvergleich' },
    { name: 'bonus.ch', url: 'https://www.bonus.ch', description: 'Prämienvergleich' },
    { name: 'priminfo.ch', url: 'https://www.priminfo.admin.ch', description: 'Offizieller KK-Vergleich' }
  ]},
  { category: 'Steuern & Finanzen', links: [
    { name: 'Steuerrechner', url: 'https://www.comparis.ch/steuern', description: 'Steuerbelastung berechnen' },
    { name: 'Lohnrechner', url: 'https://www.lohncomputer.ch', description: 'Netto-Lohn berechnen' },
    { name: 'finpension', url: 'https://www.finpension.ch', description: 'Günstige 3a-Vorsorge' },
    { name: 'VIAC', url: 'https://www.viac.ch', description: 'Digitale 3a-Lösung' }
  ]},
  { category: 'Wohnen', links: [
    { name: 'immoscout24.ch', url: 'https://www.immoscout24.ch', description: 'Wohnungssuche' },
    { name: 'homegate.ch', url: 'https://www.homegate.ch', description: 'Immobilienportal' },
    { name: 'wgzimmer.ch', url: 'https://www.wgzimmer.ch', description: 'WG-Zimmer finden' }
  ]},
  { category: 'Behörden & Formulare', links: [
    { name: 'ch.ch', url: 'https://www.ch.ch', description: 'Offizielles Behördenportal' },
    { name: 'Zoll (BAZG)', url: 'https://www.bazg.admin.ch', description: 'Zollformulare' },
    { name: 'admin.ch', url: 'https://www.admin.ch', description: 'Bundesverwaltung' }
  ]}
];

// Beispiel-Community-Beiträge
export const samplePosts = {
  'arbeitgeber-erfahrungen': [
    {
      id: 1,
      author: 'Marco S.',
      avatar: 'MS',
      date: '2024-12-10',
      title: 'Erfahrung bei Swiss Re in Zürich?',
      content: 'Hat jemand Erfahrungen bei Swiss Re gemacht? Habe ein Angebot bekommen und würde gerne wissen, wie die Arbeitskultur ist.',
      likes: 12,
      replies: [
        { author: 'Anna K.', avatar: 'AK', content: 'War 2 Jahre dort! Sehr internationale Atmosphäre, gute Benefits. Kann ich empfehlen!', date: '2024-12-10' },
        { author: 'Thomas B.', avatar: 'TB', content: 'Bekannter arbeitet dort - sagt Work-Life-Balance ist gut, 13. Monatslohn + Bonus.', date: '2024-12-11' }
      ]
    },
    {
      id: 2,
      author: 'Julia M.',
      avatar: 'JM',
      date: '2024-12-08',
      title: 'IT-Firmen in Basel - Empfehlungen?',
      content: 'Bin Software-Entwicklerin und ziehe nach Basel. Welche IT-Firmen könnt ihr empfehlen? Pharma oder eher Startup?',
      likes: 8,
      replies: [
        { author: 'David R.', avatar: 'DR', content: 'Roche und Novartis haben grosse IT-Abteilungen. Gute Löhne, stabil. Startups findest du im Basel Area.', date: '2024-12-09' }
      ]
    }
  ],
  'erfolge-und-meilensteine': [
    {
      id: 1,
      author: 'Sarah L.',
      avatar: 'SL',
      date: '2024-12-11',
      title: '🎉 Wir sind angekommen!',
      content: 'Nach 3 Monaten Vorbereitung sind wir endlich in Zürich! Anmeldung geschafft, Wohnung bezogen. Danke an diese Community für all die Tipps!',
      likes: 45,
      replies: [
        { author: 'Admin', avatar: 'DC', content: 'Herzlichen Glückwunsch! Willkommen in der Schweiz! 🇨🇭', date: '2024-12-11' },
        { author: 'Peter H.', avatar: 'PH', content: 'Super! Viel Erfolg beim Einleben!', date: '2024-12-11' }
      ]
    },
    {
      id: 2,
      author: 'Michael T.',
      avatar: 'MT',
      date: '2024-12-09',
      title: '✅ Job gefunden nach 2 Wochen!',
      content: 'Dank der Tipps hier habe ich meinen Traumjob gefunden! Senior Developer bei einem Fintech in Zug. Die Bewerbungs-Checkliste war Gold wert.',
      likes: 32,
      replies: []
    }
  ],
  'allgemein': [
    {
      id: 1,
      author: 'Nina W.',
      avatar: 'NW',
      date: '2024-12-10',
      title: 'Erste Schritte - wo anfangen?',
      content: 'Hallo zusammen! Ich plane in 6 Monaten in die Schweiz zu ziehen. Womit sollte ich am besten anfangen? Job oder Wohnung zuerst?',
      likes: 5,
      replies: [
        { author: 'Vale (Admin)', avatar: 'V', content: 'Immer zuerst der Job! Ohne Arbeitsvertrag bekommst du keine B-Bewilligung und ohne die keine Wohnung. Schau dir Modul 1 in der Video-Akademie an!', date: '2024-12-10' }
      ]
    }
  ]
};
