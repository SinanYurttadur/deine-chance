import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import { CheckCircle, PartyPopper, Download, ArrowRight, Sparkles } from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

const Welcome = () => {
  usePageTitle('Willkommen');
  const { user } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      if (!isMounted) return;

      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF0000', '#FFFFFF', '#FFD700']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF0000', '#FFFFFF', '#FFD700']
      });
    }, 250);

    setTimeout(() => {
      if (isMounted) setShowContent(true);
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

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
    doc.rect(width / 2 - 2.5, 30, 5, 20, 'F');
    doc.rect(width / 2 - 10, 37.5, 20, 5, 'F');

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

    // Text
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
    doc.text(`Mitgliedsnummer: ${user.certificateNumber || user.certificate_number || 'DC-2025-XXXXX'}`, width / 2, 152, { align: 'center' });

    // Datum
    const memberSince = user.accessGrantedAt || user.access_granted_at || user.paid_at || new Date().toISOString();
    const dateStr = new Date(memberSince).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
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

  // Formatiere Datum sicher
  const getMemberDate = () => {
    const dateValue = user.accessGrantedAt || user.access_granted_at || user.paid_at;
    if (!dateValue) return new Date().toLocaleDateString('de-DE');
    const date = new Date(dateValue);
    // Check if date is valid and not 1970
    if (isNaN(date.getTime()) || date.getFullYear() < 2000) {
      return new Date().toLocaleDateString('de-DE');
    }
    return date.toLocaleDateString('de-DE');
  };

  // Mitgliedsnummer
  const memberNumber = user.certificateNumber || user.certificate_number || 'Wird generiert...';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center justify-center py-12 px-4">
      <div className={`max-w-2xl w-full transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <PartyPopper className="w-5 h-5 text-yellow-800" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Willkommen bei Deine Chance! 🎉
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Herzlichen Glückwunsch, <span className="font-semibold text-swiss-red">{user.firstName}</span>!
            Deine Mitgliedschaft ist jetzt aktiv.
          </p>

          {/* Membership Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
            {/* Swiss cross watermark */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <svg viewBox="0 0 100 100">
                <rect x="35" y="10" width="30" height="80" fill="currentColor" />
                <rect x="10" y="35" width="80" height="30" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-swiss-red rounded-lg flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-5 bg-white rounded-[1px]" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-2 bg-white rounded-[1px]" />
                    </div>
                  </div>
                  <span className="font-semibold">Deine Chance e.V.</span>
                </div>
                <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Aktiv</span>
                </div>
              </div>

              <div className="text-left space-y-1">
                <p className="text-gray-400 text-sm">Mitglied</p>
                <p className="text-xl font-semibold">{user.firstName} {user.lastName}</p>
              </div>

              <div className="flex justify-between items-end mt-6">
                <div>
                  <p className="text-gray-400 text-xs">Mitgliedsnummer</p>
                  <p className="font-mono">{memberNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Gültig ab</p>
                  <p className="font-mono">{getMemberDate()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-swiss-red">500+</p>
              <p className="text-sm text-gray-600">Jobs</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-swiss-red">50+</p>
              <p className="text-sm text-gray-600">Vorlagen</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-2xl font-bold text-swiss-red">24/7</p>
              <p className="text-sm text-gray-600">Support</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              to="/portal"
              className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              Zum Portal
              <ArrowRight className="w-5 h-5" />
            </Link>

            <button
              onClick={downloadCertificate}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Zertifikat herunterladen (PDF)
            </button>
          </div>

          {/* Next Steps */}
          <div className="mt-10 pt-8 border-t border-gray-100 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Deine nächsten Schritte:</h3>
            <div className="space-y-3">
              {[
                'Profil im Portal vervollständigen',
                'Lebenslauf hochladen',
                'Erste Stellenangebote ansehen',
                'Community beitreten'
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-swiss-red/10 rounded-full flex items-center justify-center text-swiss-red text-sm font-semibold">
                    {i + 1}
                  </div>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-sm text-blue-800">
            📧 Eine Bestätigungs-E-Mail wurde an <strong>{user.email}</strong> gesendet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
