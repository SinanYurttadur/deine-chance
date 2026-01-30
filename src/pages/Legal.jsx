import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { ArrowLeft, FileText, Shield, Euro, Building2 } from 'lucide-react';

const Legal = () => {
  usePageTitle('Rechtliches');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-swiss-red transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-12">
          <a href="#agb" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <FileText className="w-4 h-4 text-swiss-red" />
            <span>AGB</span>
          </a>
          <a href="#beitragsordnung" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <Euro className="w-4 h-4 text-swiss-red" />
            <span>Beitragsordnung</span>
          </a>
          <a href="#impressum" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <Building2 className="w-4 h-4 text-swiss-red" />
            <span>Impressum</span>
          </a>
          <a href="#datenschutz" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <Shield className="w-4 h-4 text-swiss-red" />
            <span>Datenschutz</span>
          </a>
        </div>

        {/* AGB Section */}
        <section id="agb" className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Allgemeine Geschäftsbedingungen</h1>
          <p className="text-gray-500 mb-8">für die Plattform von Deine Chance e.V. | Stand: 22.05.2025</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Geltungsbereich</h2>
            <p className="text-gray-600 mb-4">
              Diese Nutzungsbedingungen gelten für alle registrierten Mitglieder von <strong>Deine Chance e.V.</strong>,
              die Zugang zur geschlossenen Online-Plattform des Vereins erhalten. Mit dem Beitritt und der Nutzung der
              Plattform erkennen Sie diese Bedingungen als verbindlich an.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Mitgliedschaft</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Der Zugang zur Plattform ist ausschließlich natürlichen oder juristischen Personen vorbehalten, die ordentliche Mitglieder des Vereins sind.</li>
              <li>Die Mitgliedschaft begründet kein Anspruch auf konkrete Leistungen, sondern dient der gemeinschaftlichen Nutzung der Vereinsinfrastruktur im Rahmen des satzungsgemäßen Zwecks.</li>
              <li>Die Nutzung ist nicht übertragbar und darf nur durch das registrierte Mitglied selbst erfolgen.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Leistungen des Vereins</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Der Verein stellt eine digitale Plattform bereit, auf der Inhalte, Ressourcen, Hinweise und Erfahrungsberichte zur Verfügung gestellt werden.</li>
              <li>Ziel ist es, den Austausch unter den Mitgliedern zu fördern sowie Wissen und Orientierung im Bereich Auswanderung und Neuorientierung bereitzustellen.</li>
              <li>Es besteht kein Anspruch auf Verfügbarkeit, Aktualität oder Vollständigkeit einzelner Inhalte.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Keine individuelle Beratung</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Die bereitgestellten Inhalte stellen keine rechtliche, steuerliche oder individuelle Beratung dar.</li>
              <li>Die Mitglieder nutzen die Plattform auf eigene Verantwortung.</li>
              <li>Der Verein vermittelt keine persönlichen Dienstleistungen oder verbindlichen Handlungsempfehlungen.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Mitgliedsbeiträge</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Für die Nutzung der Plattform ist eine aktive Mitgliedschaft erforderlich.</li>
              <li>Der Mitgliedsbeitrag wird gemäß Satzung erhoben und dient ausschließlich der Finanzierung der satzungsgemäßen Vereinsaufgaben.</li>
              <li>Der Zugang endet automatisch bei Austritt aus dem Verein.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Verhaltensregeln</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Mitglieder verpflichten sich zu respektvollem, sachlichem Umgang.</li>
              <li>Diskriminierende, beleidigende oder rechtswidrige Inhalte sind untersagt und führen zum Ausschluss.</li>
              <li>Inhalte der Plattform dürfen nicht ohne schriftliche Zustimmung des Vereins extern veröffentlicht oder weitergegeben werden.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Haftung</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Der Verein haftet nicht für Schäden, die aus der Nutzung oder Nichtverfügbarkeit der Plattform entstehen, es sei denn, diese beruhen auf vorsätzlichem oder grob fahrlässigem Verhalten.</li>
              <li>Für Inhalte, die von Mitgliedern eingestellt werden, ist ausschließlich das jeweilige Mitglied verantwortlich.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Änderungen der Nutzungsbedingungen</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Der Verein behält sich vor, diese Bedingungen anzupassen, sofern dies sachlich erforderlich ist.</li>
              <li>Mitglieder werden über Änderungen rechtzeitig informiert.</li>
              <li>Widerspricht ein Mitglied der Änderung nicht innerhalb von 14 Tagen, gilt diese als angenommen.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Gerichtsstand und Schlussbestimmungen</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Es gilt das Recht der Bundesrepublik Deutschland.</li>
              <li>Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz des Vereins.</li>
              <li>Sollte eine Bestimmung dieser Bedingungen unwirksam sein, bleiben die übrigen Regelungen davon unberührt.</li>
            </ol>
          </div>
        </section>

        {/* Beitragsordnung Section */}
        <section id="beitragsordnung" className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Beitragsordnung</h1>
          <p className="text-gray-500 mb-8">Deine Chance e.V.</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">§1 Grundlage</h2>
            <p className="text-gray-600 mb-4">
              Diese Beitragsordnung regelt die Erhebung und Verwendung der Mitgliedsbeiträge gemäß § 4 der Satzung des
              Vereins <strong>„Deine Chance e.V."</strong>. Sie ist nicht Bestandteil der Satzung, wurde jedoch durch den
              Vorstand beschlossen und kann durch diesen angepasst werden.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">§2 Zweck der Beiträge</h2>
            <p className="text-gray-600 mb-4">
              Die Mitgliedsbeiträge dienen ausschließlich der Finanzierung der satzungsgemäßen Vereinsaufgaben.
              Sie stellen keine Gegenleistung für konkrete Leistungen dar. Die Beiträge werden insbesondere verwendet für:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>den Betrieb und die Pflege der digitalen Vereinsplattform</li>
              <li>Kommunikations- und Informationsangebote für Mitglieder</li>
              <li>Verwaltungskosten des Vereins</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">§3 Beitragshöhe</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Der reguläre Mitgliedsbeitrag beträgt: <strong className="text-swiss-red">249 € pro Jahr</strong></li>
              <li>Der Beitrag ist im Voraus fällig.</li>
              <li>Eine Reduzierung oder Befreiung kann auf schriftlichen Antrag durch Vorstandsbeschluss erfolgen (Härtefallregelung).</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">§4 Zahlungsweise</h2>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4">
              <li>Die Zahlung erfolgt über die Plattform – dort sind gängige Zahlungsmittel wie SEPA-Lastschriftverfahren oder per Überweisung vorhanden.</li>
              <li>Der Einzugstermin ist der 1. eines jeden Monats bzw. Jahresbeginns.</li>
              <li>Bei Rücklastschriften trägt das Mitglied die entstehenden Bankgebühren.</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">§5 Rückerstattung</h2>
            <p className="text-gray-600 mb-4">
              Eine anteilige oder vollständige Rückerstattung des Mitgliedsbeitrags bei Austritt, Ausschluss oder
              Nichtnutzung der Plattform ist ausgeschlossen.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">§6 Inkrafttreten</h2>
            <p className="text-gray-600 mb-4">
              Diese Beitragsordnung tritt am 22.05.2025 in Kraft und gilt für alle bestehenden und zukünftigen Mitglieder.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">Ort, Datum</p>
              <p className="text-gray-600 italic">Unterschrift Vorstand (Sinan Yurttadur)</p>
            </div>
          </div>
        </section>

        {/* Impressum Section */}
        <section id="impressum" className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-500 mb-4">Angaben gemäß § 5 TMG:</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Vereinssitz Deutschland */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🇩🇪</span>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Vereinssitz</span>
                </div>
                <p className="font-bold text-gray-900 text-lg">Deine Chance e.V.</p>
                <p className="text-gray-600">Zettachring 12a</p>
                <p className="text-gray-600">70567 Stuttgart</p>
                <p className="text-gray-600">Deutschland</p>
              </div>

              {/* Zweigstelle Schweiz */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🇨🇭</span>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Zweigstelle</span>
                </div>
                <p className="font-bold text-gray-900 text-lg">Deine Chance e.V.</p>
                <p className="text-gray-600">Zürich</p>
                <p className="text-gray-600">Schweiz</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Vertreten durch:</h2>
            <ul className="list-none text-gray-600 space-y-1 mb-4">
              <li>1. Vorsitzender: Theodoros Ioannidis</li>
              <li>2. Vorsitzender: Sinan Yurttadur</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Kontakt:</h2>
            <p className="text-gray-600 mb-4">
              E-Mail: <a href="mailto:deinechance@mail.de" className="text-swiss-red hover:underline">deinechance@mail.de</a>
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
            <div className="text-gray-600">
              <p>Deine Chance e.V.</p>
              <p>Zettachring 12a</p>
              <p>70567 Stuttgart</p>
              <p>Deutschland</p>
            </div>
          </div>
        </section>

        {/* Datenschutz Section */}
        <section id="datenschutz" className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Datenschutzerklärung</h1>
          <p className="text-gray-500 mb-8">gemäß DSGVO | Gültig ab 01.05.2025</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Allgemeines</h2>
            <p className="text-gray-600 mb-4">
              Der Schutz Ihrer Daten ist uns wichtig. Nachfolgend informieren wir Sie darüber, welche personenbezogenen
              Daten wir beim Besuch unserer Website und bei Nutzung unserer Plattform erheben und wie wir sie verarbeiten.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Verantwortlicher</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="font-bold text-gray-900">Deine Chance e.V.</p>
              <p className="text-gray-600">Zettachring 12a</p>
              <p className="text-gray-600">70567 Stuttgart, Deutschland</p>
              <p className="text-gray-600">E-Mail: deinechance@mail.de</p>
              <p className="text-gray-600 mt-2">Vertreten durch den Vorstand</p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Erhebung und Speicherung personenbezogener Daten</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Beim Websitebesuch:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>IP-Adresse</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>Browsertyp, Betriebssystem, Referrer-URL</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Diese Daten dienen der technischen Sicherstellung und werden automatisch durch den Server erhoben.
              Eine Zusammenführung mit anderen Datenquellen erfolgt nicht.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Bei Kontaktaufnahme per E-Mail oder Formular:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>freiwillige Angaben</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO).
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Bei Registrierung als Mitglied:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Name</li>
              <li>Adresse</li>
              <li>E-Mail-Adresse</li>
              <li>Zahlungsdaten (je nach Zahlungsart)</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Die Verarbeitung erfolgt zur Durchführung der Mitgliedschaft (Art. 6 Abs. 1 lit. b DSGVO).
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Plattform-Nutzung</h2>
            <p className="text-gray-600 mb-4">
              Bei Nutzung unserer Plattform gelten zusätzlich die Datenschutzbedingungen des jeweiligen Plattformanbieters
              (z. B. CircleCo, Inc.). Wir haben mit dem Anbieter einen Auftragsverarbeitungsvertrag (AVV) abgeschlossen.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Cookies & Tracking</h2>
            <p className="text-gray-600 mb-4">
              Unsere Website verwendet technisch notwendige Cookies. Analyse- oder Marketingtools setzen wir nur mit
              Ihrer Einwilligung (Cookie-Banner).
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Weitergabe von Daten</h2>
            <p className="text-gray-600 mb-4">
              Wir geben keine personenbezogenen Daten an Dritte weiter, außer es ist gesetzlich vorgeschrieben oder
              zur Vertragsdurchführung erforderlich (z. B. Zahlungsanbieter, IT-Dienstleister).
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Ihre Rechte</h2>
            <p className="text-gray-600 mb-2">Sie haben das Recht auf:</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Auskunft über Ihre Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung (Art. 16 DSGVO)</li>
              <li>Löschung (Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Widerspruch (Art. 21 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Aufsichtsbehörde</h2>
            <p className="text-gray-600 mb-4">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. In der Regel ist dies
              die für Ihren Wohnsitz zuständige Behörde.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Aktualität und Änderung</h2>
            <p className="text-gray-600 mb-4">
              Diese Datenschutzerklärung ist aktuell gültig (01.05.2025) und wird bei Bedarf aktualisiert.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link to="/" className="text-swiss-red hover:underline">
            Zurück zur Startseite
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Legal;
