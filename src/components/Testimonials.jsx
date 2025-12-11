import { Star, Quote, UserCircle, ClipboardCheck, Briefcase } from 'lucide-react';
import { usePersona } from '../context/PersonaContext';

const timelineSteps = [
  {
    icon: UserCircle,
    title: 'Mitglied werden',
    description: 'Werde Vereinsmitglied und erhalte sofort Zugang zu allen Ressourcen.',
    status: 'completed'
  },
  {
    icon: ClipboardCheck,
    title: 'Vorbereitung & Netzwerk',
    description: 'Nutze unsere Plattform, Vorlagen und vernetze dich mit der Community.',
    status: 'current'
  },
  {
    icon: Briefcase,
    title: 'Erfolgreich in der Schweiz',
    description: 'Starte dein neues Leben – und kündige die Mitgliedschaft, wenn du sie nicht mehr brauchst.',
    status: 'upcoming'
  }
];

const Testimonials = () => {
  const { content } = usePersona();
  const testimonial = content.testimonial;

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Testimonial Card */}
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-swiss-red/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-100 rounded-full blur-2xl"></div>

            <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100">
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-swiss-red rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar Placeholder */}
                <div className="w-14 h-14 bg-gradient-to-br from-swiss-red to-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-swiss-red font-medium">{testimonial.role}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute bottom-6 right-6">
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span>Verifiziertes Mitglied</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline - "Dein Weg" */}
          <div>
            <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-2 rounded-full text-sm font-semibold mb-6">
              So einfach geht's
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dein Weg in die Schweiz
            </h2>
            <p className="text-gray-600 mb-8">
              Mitglied bleiben, solange du uns brauchst. Sobald du erfolgreich ausgewandert bist
              und keine Unterstützung mehr benötigst, kannst du jederzeit kündigen.
            </p>

            {/* Timeline Steps */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              <div className="space-y-8">
                {timelineSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';

                  return (
                    <div key={index} className="relative flex gap-6">
                      {/* Icon Circle */}
                      <div
                        className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-swiss-red text-white ring-4 ring-swiss-red/20'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <Icon className="w-7 h-7" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div
                          className={`p-6 rounded-2xl transition-all duration-300 ${
                            isCurrent
                              ? 'bg-swiss-red/5 border-2 border-swiss-red/20'
                              : isCompleted
                              ? 'bg-green-50 border border-green-100'
                              : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3
                              className={`text-lg font-bold ${
                                isCurrent ? 'text-swiss-red' : isCompleted ? 'text-green-700' : 'text-gray-500'
                              }`}
                            >
                              {step.title}
                            </h3>
                            {isCurrent && (
                              <span className="bg-swiss-red text-white text-xs px-2 py-1 rounded-full">
                                Du bist hier
                              </span>
                            )}
                          </div>
                          <p className={`${isCurrent ? 'text-gray-700' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cancellation Note */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-blue-800 text-sm">
                <strong>Kein Risiko:</strong> Du kannst deine Mitgliedschaft jederzeit zum
                Jahresende kündigen. Keine versteckten Kosten, keine langfristigen Bindungen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
