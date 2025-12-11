import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PersonaProvider } from './context/PersonaContext';

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

// Pages
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Portal from './pages/Portal';
import Legal from './pages/Legal';

// Landing Page Component
const LandingPage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main>
      <Hero />
      <Process />
      <FounderStory />
      <Features />
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

function App() {
  return (
    <AuthProvider>
      <PersonaProvider>
        <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Flow */}
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />

          {/* Post-Purchase */}
          <Route path="/willkommen" element={<Welcome />} />
          <Route path="/portal" element={<Portal />} />

          {/* Legal Pages */}
          <Route path="/legal" element={<Legal />} />
          <Route path="/agb" element={<Legal />} />
          <Route path="/impressum" element={<Legal />} />
          <Route path="/datenschutz" element={<Legal />} />
        </Routes>
        </Router>
      </PersonaProvider>
    </AuthProvider>
  );
}

export default App;
