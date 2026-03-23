import { useState, useEffect } from 'react';
import { introVideo, modules, bonusVideos } from '../data/videoModules';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  Star,
} from 'lucide-react';

const STORAGE_KEY = 'deinechance_video_step';
const WATCHED_KEY = 'deinechance_videos_watched';

// All steps: intro + 8 modules + 3 bonus
const allSteps = [
  { ...introVideo, stepLabel: 'Einführung', type: 'intro' },
  ...modules.map(m => ({ ...m, stepLabel: `Modul ${m.id}`, type: 'module' })),
  ...bonusVideos.map((b, i) => ({ ...b, stepLabel: `Bonus ${i + 1}`, type: 'bonus' })),
];

const VideoAcademy = () => {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? parseInt(saved, 10) : 0;
    return parsed >= 0 && parsed < allSteps.length ? parsed : 0;
  });

  const [watchedVideos, setWatchedVideos] = useState(() => {
    try {
      const saved = localStorage.getItem(WATCHED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watchedVideos));
  }, [watchedVideos]);

  const step = allSteps[currentStep];
  const isComingSoon = step.type === 'module' && !step.heygenId;
  const progress = (watchedVideos.length / allSteps.length) * 100;
  const isCurrentWatched = watchedVideos.includes(step.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Video-Akademie</h1>
        <p className="text-gray-600 mt-1">
          Dein kompletter Video-Kurs für die Auswanderung in die Schweiz – Schritt für Schritt.
        </p>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>{step.stepLabel}</span>
          <span>{watchedVideos.length} / {allSteps.length} gesehen</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-swiss-red h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Video */}
      <div className={`rounded-2xl overflow-hidden ${
        step.type === 'intro'
          ? 'bg-gradient-to-r from-swiss-red to-red-600 text-white'
          : 'bg-white shadow-sm border border-gray-100'
      }`}>
        {/* Video or Coming Soon */}
        {isComingSoon ? (
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-swiss-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-10 h-10 text-swiss-red ml-1" />
              </div>
              <p className="text-gray-500 font-medium">Video folgt</p>
              <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                In Produktion
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-black/20">
            <iframe
              key={step.heygenId}
              width="100%"
              height="100%"
              src={`https://app.heygen.com/embeds/${step.heygenId}`}
              title={step.title}
              frameBorder="0"
              allow="encrypted-media; fullscreen"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        )}

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2 py-1 rounded ${
              step.type === 'intro'
                ? 'bg-white/20'
                : step.type === 'bonus'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-swiss-red text-white'
            }`}>
              {step.stepLabel}
            </span>
            {!isComingSoon && step.type === 'module' && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Verfügbar
              </span>
            )}
          </div>
          <h2 className={`text-xl font-bold mb-2 ${step.type === 'intro' ? '' : 'text-gray-900'}`}>
            {step.title}
          </h2>
          <p className={`text-sm ${step.type === 'intro' ? 'text-white/80' : 'text-gray-600'}`}>
            {step.description}
          </p>

          {step.type === 'intro' && (
            <div className="flex items-center gap-4 text-sm mt-4">
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" /> 8 Module
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Selbstbestimmt lernen
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück
        </button>
        <button
          onClick={() => {
            if (!isCurrentWatched) {
              setWatchedVideos(prev => [...prev, step.id]);
            }
          }}
          disabled={isCurrentWatched}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            isCurrentWatched
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          {isCurrentWatched ? 'Gesehen' : 'Als gesehen markieren'}
        </button>
        <button
          onClick={() => setCurrentStep(s => Math.min(allSteps.length - 1, s + 1))}
          disabled={currentStep === allSteps.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-swiss-red text-white hover:bg-swiss-red-dark"
        >
          Weiter
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Step Selector Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Alle Lektionen</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2">
          {allSteps.map((s, i) => {
            const isCurrent = i === currentStep;
            const comingSoon = s.type === 'module' && !s.heygenId;
            const isWatched = watchedVideos.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(i)}
                title={`${s.stepLabel}: ${s.title}`}
                className={`relative aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-swiss-red text-white ring-2 ring-swiss-red ring-offset-2'
                    : comingSoon
                      ? 'bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200'
                      : s.type === 'bonus'
                        ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                        : s.type === 'intro'
                          ? 'bg-red-50 text-swiss-red hover:bg-red-100'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                } ${isWatched && !isCurrent ? 'ring-2 ring-green-400 ring-offset-1' : ''}`}
              >
                {s.type === 'intro' ? (
                  <Play className="w-3.5 h-3.5" />
                ) : s.type === 'bonus' ? (
                  <Star className="w-3.5 h-3.5" />
                ) : (
                  s.id
                )}
                {isWatched && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 inline-block" /> Einführung</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-50 border inline-block" /> Module</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-50 inline-block" /> Bonus</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white ring-2 ring-green-400 inline-block" /> Gesehen</span>
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
            <p className="text-gray-700 text-sm">
              Wir geben dir keine fertigen Vorlagen, sondern zeigen dir Schritt für Schritt, wie du alles selbst erledigst.
              So verstehst du den Prozess wirklich und bist für alle Situationen gewappnet!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAcademy;
