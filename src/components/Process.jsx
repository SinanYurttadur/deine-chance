import { UserPlus, LayoutDashboard, FileCheck, Briefcase } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Mitglied werden',
    description: 'Registriere dich schnell und einfach auf unserer Plattform. Mit deiner Mitgliedschaft erhältst du sofort Zugang zu allen Ressourcen und Services.',
    icon: UserPlus,
    mockup: 'registration'
  },
  {
    number: '02',
    title: 'Zugang zur Plattform',
    description: 'Nach der Anmeldung erhältst du Zugriff auf unser exklusives Dashboard mit Jobportal, Dokumentenvorlagen und Community-Bereich.',
    icon: LayoutDashboard,
    mockup: 'dashboard'
  },
  {
    number: '03',
    title: 'Dokumente vorbereiten',
    description: 'Nutze unsere Vorlagen und Checklisten um alle notwendigen Dokumente für deine Auswanderung vorzubereiten. Wir prüfen alles für dich.',
    icon: FileCheck,
    mockup: 'documents'
  },
  {
    number: '04',
    title: 'Job in der Schweiz',
    description: 'Bewirb dich auf passende Stellen über unsere Jobplattform mit direktem Kontakt zu Schweizer Arbeitgebern, die internationale Bewerber suchen.',
    icon: Briefcase,
    mockup: 'jobs'
  }
];

const MockupScreen = ({ type }) => {
  const mockups = {
    registration: (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full">
        <div className="space-y-3">
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-100 rounded border border-gray-200"></div>
            <div className="h-8 bg-gray-100 rounded border border-gray-200"></div>
            <div className="h-8 bg-gray-100 rounded border border-gray-200"></div>
          </div>
          <div className="h-10 bg-swiss-red rounded"></div>
        </div>
      </div>
    ),
    dashboard: (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full">
        <div className="flex gap-2 mb-4">
          <div className="h-2 w-2 bg-red-400 rounded-full"></div>
          <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
          <div className="h-2 w-2 bg-green-400 rounded-full"></div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="h-12 bg-swiss-red/10 rounded"></div>
          <div className="h-12 bg-blue-100 rounded"></div>
          <div className="h-12 bg-green-100 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
          <div className="h-3 bg-gray-200 rounded w-3/5"></div>
        </div>
      </div>
    ),
    documents: (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <div className="w-8 h-10 bg-swiss-red/20 rounded flex items-center justify-center">
                <div className="w-4 h-5 border-2 border-swiss-red rounded-sm"></div>
              </div>
              <div className="flex-1">
                <div className="h-2 bg-gray-300 rounded w-2/3 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    jobs: (
      <div className="bg-white rounded-lg shadow-lg p-4 w-full">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-swiss-red/20 rounded px-2 text-xs"></div>
                    <div className="h-4 bg-blue-100 rounded px-2 text-xs"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return mockups[type] || mockups.dashboard;
};

const Process = () => {
  return (
    <section id="prozess" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-4">
            In 4 einfachen Schritten
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            In die Schweiz auswandern – so funktioniert es
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Dein Weg zum Arbeiten in der Schweiz war noch nie so einfach. Folge unserem bewährten Prozess
            und starte noch heute in dein neues Leben.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24 md:space-y-32">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 1;

            return (
              <div
                key={step.number}
                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}
              >
                {/* Content */}
                <div className="flex-1 w-full">
                  <div className={`${isEven ? 'lg:pl-12' : 'lg:pr-12'}`}>
                    {/* Step Number */}
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-6xl md:text-7xl font-bold text-swiss-red/20">
                        {step.number}
                      </span>
                      <div className="w-12 h-12 bg-swiss-red rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Progress indicator */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block mt-8">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-1 bg-swiss-red rounded"></div>
                          <div className="w-4 h-1 bg-swiss-red/50 rounded"></div>
                          <div className="w-2 h-1 bg-swiss-red/25 rounded"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mockup */}
                <div className="flex-1 w-full max-w-md lg:max-w-none">
                  <div className="relative">
                    {/* Decorative background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${isEven ? 'from-blue-100 to-purple-100' : 'from-red-100 to-orange-100'} rounded-3xl transform ${isEven ? 'rotate-3' : '-rotate-3'}`}></div>

                    {/* Mockup container */}
                    <div className="relative bg-gray-100 rounded-2xl p-6 shadow-xl">
                      <MockupScreen type={step.mockup} />
                    </div>

                    {/* Floating badge */}
                    <div className={`absolute ${isEven ? '-left-4' : '-right-4'} -bottom-4 bg-white rounded-xl shadow-lg p-3`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700">Schritt {index + 1} von 4</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
