import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey || stripePublishableKey === 'pk_test_DEINE_PUBLISHABLE_KEY_HIER') {
  console.warn(
    '⚠️ Stripe ist im Demo-Modus. Für echte Zahlungen:\n' +
    '1. Erstelle ein Stripe-Konto: https://dashboard.stripe.com/register\n' +
    '2. Hole deine Test-Keys: https://dashboard.stripe.com/test/apikeys\n' +
    '3. Füge sie in .env ein:\n' +
    '   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...\n' +
    '   STRIPE_SECRET_KEY=sk_test_...'
  );
}

// Stripe Promise - lädt Stripe.js nur wenn gültiger Key vorhanden
export const stripePromise = stripePublishableKey &&
  !stripePublishableKey.includes('DEINE_PUBLISHABLE_KEY_HIER')
    ? loadStripe(stripePublishableKey)
    : null;

// Prüft ob Stripe konfiguriert ist
export const isStripeConfigured = () => {
  return stripePublishableKey &&
    !stripePublishableKey.includes('DEINE_PUBLISHABLE_KEY_HIER');
};

// Produkt-Konfiguration
export const MEMBERSHIP_PRODUCT = {
  name: 'Deine Chance e.V. Jahresmitgliedschaft',
  description: 'Vollzugang zur Auswanderer-Plattform für 12 Monate',
  price: 24900, // in Cents (249€)
  currency: 'eur',
  interval: 'year'
};
