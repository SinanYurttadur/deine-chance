import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PersonaProvider, usePersona } from './context/PersonaContext';

// Landing Page Components
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
import FounderStory from './components/FounderStory';
import Features from './components/Features';
import Certificate from './components/Certificate';
import ValueGrid from './components/ValueGrid';
import Network from './components/Network';
import Testimonials from './components/Testimonials';
import SocialProof from './components/SocialProof';
import LeadForm from './components/LeadForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SalaryCalculatorCompact from './components/SalaryCalculatorCompact';

// Pages
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Portal from './pages/Portal';
import Legal from './pages/Legal';
import Cancel from './pages/Cancel';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Landing Page Component
const LandingPage = () => {
  const { currentPersona } = usePersona();
  const showSalaryCalculator = !['selbststaendig', 'unternehmer'].includes(currentPersona);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Process />
        <FounderStory />
        <Features />
        {/* Salary Calculator Section - nur für Angestellte */}
        {showSalaryCalculator && (
          <section id="gehaltsrechner" className="py-16 md:py-24 bg-gray-50 scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-10">
                <span className="inline-block bg-swiss-red/10 text-swiss-red px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  Interaktiver Rechner
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Wieviel mehr könntest du verdienen?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Berechne in 10 Sekunden, was du in der Schweiz verdienen könntest – und wie viel mehr am Ende des Monats übrig bleibt.
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <SalaryCalculatorCompact />
              </div>
            </div>
          </section>
        )}
        <Certificate />
        <ValueGrid />
        <Network />
        <Testimonials />
        <SocialProof />
        <LeadForm />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <PersonaProvider>
        <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Flow */}
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/passwort-vergessen" element={<ForgotPassword />} />
          <Route path="/passwort-neu" element={<ResetPassword />} />

          {/* Post-Purchase (Auth + aktive Mitgliedschaft erforderlich) */}
          <Route path="/willkommen" element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          } />
          <Route path="/portal" element={
            <ProtectedRoute requireMembership>
              <Portal />
            </ProtectedRoute>
          } />

          {/* Legal Pages */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/agb" element={<Legal />} />
          <Route path="/impressum" element={<Legal />} />
          <Route path="/datenschutz" element={<Legal />} />

          {/* Cancel Membership (Auth erforderlich) */}
          <Route path="/kuendigen" element={
            <ProtectedRoute>
              <Cancel />
            </ProtectedRoute>
          } />
        </Routes>
        </Router>
      </PersonaProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
