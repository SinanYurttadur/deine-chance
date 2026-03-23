import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { PersonaProvider, usePersona } from './context/PersonaContext';

// Landing Page Components (above the fold – no lazy loading)
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
import AIBeraterSection from './components/AIBeraterSection';

// Pages – lazy loaded for better performance
const Register = lazy(() => import('./pages/Register'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Portal = lazy(() => import('./pages/Portal'));
const Legal = lazy(() => import('./pages/Legal'));
const Cancel = lazy(() => import('./pages/Cancel'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import CookieBanner from './components/CookieBanner';

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-swiss-red border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Landing Page Component
const LandingPage = () => {
  const { currentPersona } = usePersona();
  const showSalaryCalculator = !['selbststaendig', 'unternehmer'].includes(currentPersona);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Gehaltsrechner Schweiz | Auswandern & mehr verdienen | Deine Chance e.V.</title>
        <meta name="description" content="Berechne kostenlos, was du in der Schweiz verdienen könntest. Gehaltsrechner mit Steuervergleich DE vs CH. Professionelle Auswanderer-Unterstützung für nur 249€." />
        <link rel="canonical" href="https://deinechance24.org/" />
      </Helmet>
      <Header />
      <main id="main-content">
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
                  Gehalt Schweiz vs. Deutschland – wieviel mehr verdienst du?
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
        <AIBeraterSection />
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
        <Suspense fallback={<PageLoader />}>
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
            <ProtectedRoute requireMembership>
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

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <CookieBanner />
        </Router>
      </PersonaProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
