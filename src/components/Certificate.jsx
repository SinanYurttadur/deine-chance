import { Shield, Award, CheckCircle, FileCheck } from 'lucide-react';

const benefits = [
  {
    icon: Shield,
    title: 'Offiziell anerkannt',
    description: 'Unser Zertifikat wird von Behörden und Arbeitgebern in der Schweiz anerkannt.'
  },
  {
    icon: Award,
    title: 'Qualitätssiegel',
    description: 'Das Zertifikat bestätigt deine Vorbereitung auf den Schweizer Arbeitsmarkt.'
  },
  {
    icon: CheckCircle,
    title: 'Vertrauensbeweis',
    description: 'Zeige potenziellen Arbeitgebern, dass du dich professionell vorbereitet hast.'
  },
  {
    icon: FileCheck,
    title: 'Dokumentation',
    description: 'Lückenlose Nachverfolgung deiner Auswanderungsschritte und Qualifikationen.'
  }
];

const Certificate = () => {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Exklusiv für Mitglieder
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Dein offizielles Mitgliedschafts&shy;zertifikat
            </h2>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Als Mitglied bei Deine Chance e.V. erhältst du ein offizielles Zertifikat,
              das deine Mitgliedschaft und Vorbereitung auf die Auswanderung in die Schweiz bestätigt.
              Dieses Dokument wird von Arbeitgebern geschätzt und zeigt dein Engagement.
            </p>

            {/* Benefits Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-swiss-red/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-swiss-red" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Content - Certificate Image */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-swiss-red/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-yellow-100 rounded-full blur-2xl"></div>

            {/* Certificate Card */}
            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              {/* Certificate */}
              <div className="bg-white rounded-2xl border-4 border-double border-gray-300 p-8 relative overflow-hidden">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <svg viewBox="0 0 100 100" className="w-64 h-64">
                    <rect x="35" y="20" width="30" height="60" fill="currentColor" />
                    <rect x="20" y="35" width="60" height="30" fill="currentColor" />
                  </svg>
                </div>

                {/* Certificate Content */}
                <div className="relative text-center">
                  {/* Header */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-swiss-red rounded-full flex items-center justify-center relative">
                      {/* Schweizer Kreuz */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-8 bg-white rounded-[1px]" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-3 bg-white rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm text-gray-500 uppercase tracking-widest mb-2">
                    Deine Chance e.V.
                  </h3>

                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                    Mitgliedschaftszertifikat
                  </h2>

                  <div className="w-24 h-1 bg-swiss-red mx-auto mb-6"></div>

                  <p className="text-gray-600 mb-2">Hiermit wird bestätigt, dass</p>
                  <p className="text-xl font-semibold text-gray-900 mb-2">[Ihr Name]</p>
                  <p className="text-gray-600 mb-6">
                    offizielles Mitglied bei Deine Chance e.V. ist und sich auf die
                    Auswanderung in die Schweiz vorbereitet.
                  </p>

                  {/* Certificate ID */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-6">
                    <p className="text-xs text-gray-500">Zertifikat-Nr.</p>
                    <p className="font-mono text-gray-900">DC-2024-XXXXX</p>
                  </div>

                  {/* Signature and Stamp Area */}
                  <div className="flex justify-between items-end">
                    <div className="text-left">
                      <div className="w-24 border-b border-gray-400 mb-1"></div>
                      <p className="text-xs text-gray-500">Datum</p>
                    </div>

                    <div className="text-right">
                      <div className="w-24 border-b border-gray-400 mb-1"></div>
                      <p className="text-xs text-gray-500">Unterschrift</p>
                    </div>
                  </div>
                </div>

                {/* Official Stamp */}
                <div className="absolute bottom-16 right-8 transform rotate-12">
                  <div className="w-20 h-20 border-4 border-swiss-red rounded-full flex items-center justify-center bg-white/80">
                    <div className="text-center">
                      <p className="text-[8px] text-swiss-red font-bold uppercase">Geprüft</p>
                      <p className="text-[6px] text-swiss-red">&</p>
                      <p className="text-[8px] text-swiss-red font-bold uppercase">Zertifiziert</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative corner ribbons */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-8 bg-swiss-red transform rotate-45 translate-x-8 -translate-y-4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificate;
