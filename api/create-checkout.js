import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS – www und non-www unterstützen
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    process.env.ALLOWED_ORIGIN || 'https://deinechance24.org',
    'https://www.deinechance24.org',
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Env-Vars prüfen
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY ist nicht konfiguriert');
    return res.status(500).json({ error: 'Zahlungssystem nicht konfiguriert. Bitte kontaktiere den Support.' });
  }
  if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase Env-Vars fehlen:', {
      url: !!process.env.VITE_SUPABASE_URL,
      key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
    return res.status(500).json({ error: 'Server-Konfiguration unvollständig. Bitte kontaktiere den Support.' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Auth-Token prüfen
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Nicht autorisiert – kein Token' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth-Fehler:', authError?.message);
      return res.status(401).json({ error: 'Sitzung ungültig. Bitte erneut anmelden.' });
    }

    const siteUrl = process.env.SITE_URL || 'https://deinechance24.org';

    // Checkout Session erstellen – Preis wird SERVER-SEITIG definiert
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      mode: 'payment',
      allow_promotion_codes: true,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        product: 'jahresmitgliedschaft',
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Deine Chance e.V. Jahresmitgliedschaft',
              description: 'Vollzugang zur Auswanderer-Plattform für 12 Monate',
            },
            unit_amount: 24900, // 249€
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/willkommen?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', {
      type: err.type,
      name: err.name,
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
    });

    // Spezifische Stripe-Fehler
    if (err.type === 'StripeAuthenticationError') {
      return res.status(500).json({ error: 'Zahlungssystem-Authentifizierung fehlgeschlagen. Bitte kontaktiere den Support.' });
    }
    if (err.type === 'StripeInvalidRequestError') {
      return res.status(500).json({ error: `Stripe-Fehler: ${err.message}` });
    }

    return res.status(500).json({
      error: err.message || 'Checkout konnte nicht erstellt werden. Bitte versuche es erneut.',
    });
  }
}
