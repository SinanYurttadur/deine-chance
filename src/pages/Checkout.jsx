import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  Building2,
  Wallet,
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const paymentMethods = [
  { id: 'card', name: 'Kreditkarte', icon: CreditCard, description: 'Visa, Mastercard, Amex' },
  { id: 'sepa', name: 'SEPA Lastschrift', icon: Building2, description: 'Bankeinzug' },
  { id: 'paypal', name: 'PayPal', icon: Wallet, description: 'PayPal Konto' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { getPendingRegistration, completePurchase } = useAuth();
  const [pendingUser, setPendingUser] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  useEffect(() => {
    const pending = getPendingRegistration();
    if (!pending) {
      // No pending registration, redirect to register
      navigate('/register');
      return;
    }
    setPendingUser(pending);
  }, []);

  const handleCardChange = (e) => {
    let { name, value } = e.target;

    // Format card number with spaces
    if (name === 'number') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      value = value.substring(0, 19);
    }

    // Format expiry date
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
    }

    // Limit CVC
    if (name === 'cvc') {
      value = value.substring(0, 4);
    }

    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    try {
      // Complete the purchase
      completePurchase({
        method: selectedMethod,
        ...(selectedMethod === 'card' && { last4: cardData.number.slice(-4) })
      });

      // Redirect to success/dashboard
      navigate('/willkommen');
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  if (!pendingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-swiss-red border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/register"
          className="inline-flex items-center text-gray-600 hover:text-swiss-red mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Registrierung
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-green-500 text-white">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="w-20 h-1 bg-green-500"></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-swiss-red text-white">
              2
            </div>
            <div className="w-20 h-1 bg-gray-200"></div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gray-200 text-gray-500">
              3
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">Schritt 2: Zahlung</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Zahlungsmethode wählen
              </h1>

              {/* Payment Methods */}
              <div className="space-y-3 mb-8">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedMethod === method.id
                          ? 'border-swiss-red bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedMethod === method.id ? 'bg-swiss-red text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id ? 'border-swiss-red' : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.id && (
                          <div className="w-3 h-3 bg-swiss-red rounded-full"></div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Card Form */}
              {selectedMethod === 'card' && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kartennummer
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="number"
                        value={cardData.number}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name auf der Karte
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={cardData.name}
                      onChange={handleCardChange}
                      placeholder="Max Mustermann"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gültig bis
                      </label>
                      <input
                        type="text"
                        name="expiry"
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/JJ"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={cardData.cvc}
                        onChange={handleCardChange}
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Zahlung wird verarbeitet...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Jetzt 249€ bezahlen
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* SEPA Form */}
              {selectedMethod === 'sepa' && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IBAN
                    </label>
                    <input
                      type="text"
                      placeholder="DE89 3704 0044 0532 0130 00"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontoinhaber
                    </label>
                    <input
                      type="text"
                      placeholder="Max Mustermann"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-swiss-red focus:ring-2 focus:ring-swiss-red/20 outline-none transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-swiss-red hover:bg-swiss-red-dark text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Zahlung wird verarbeitet...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        SEPA-Mandat erteilen & 249€ bezahlen
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* PayPal */}
              {selectedMethod === 'paypal' && (
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-blue-800">
                      Du wirst zu PayPal weitergeleitet, um die Zahlung abzuschließen.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Weiterleitung zu PayPal...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Mit PayPal bezahlen
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Security Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Sicher bezahlen</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Deine Bestellung
              </h2>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-medium text-gray-900">
                  {pendingUser.firstName} {pendingUser.lastName}
                </p>
                <p className="text-sm text-gray-500">{pendingUser.email}</p>
              </div>

              {/* Product */}
              <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Mitgliedschaft</p>
                    <p className="text-sm text-gray-500">Deine Chance e.V.</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">249€</p>
                    <p className="text-sm text-gray-400 line-through">499€</p>
                  </div>
                </div>
              </div>

              {/* Included */}
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-700">Inklusive:</p>
                {[
                  'Lebenslanger Plattformzugang',
                  'Jobplattform & Stellenangebote',
                  'Dokumentenvorlagen',
                  'Community-Zugang',
                  'Persönlicher Support',
                  'Mitgliedschaftszertifikat'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-gray-900 text-white rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Gesamtsumme</span>
                  <span className="text-2xl font-bold">249€</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Einmalzahlung, kein Abo</p>
              </div>

              {/* Guarantee */}
              <div className="flex items-start gap-3 bg-green-50 rounded-xl p-4">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800 text-sm">14 Tage Geld-zurück-Garantie</p>
                  <p className="text-xs text-green-600">Nicht zufrieden? Volle Erstattung ohne Fragen.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Demo-Modus</p>
            <p className="text-sm text-yellow-700">
              Dies ist eine Testumgebung. Keine echte Zahlung wird durchgeführt.
              Verwende beliebige Testdaten um fortzufahren.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
