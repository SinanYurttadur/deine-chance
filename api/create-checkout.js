import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // CORS
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://deinechance24.org';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Auth-Token prüfen
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Nicht autorisiert' });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return res.status(401).json({ error: 'Nicht autorisiert' });
    }

    const siteUrl = process.env.SITE_URL || 'https://deinechance24.org';

    // Checkout Session erstellen – Preis wird SERVER-SEITIG definiert
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      mode: 'payment',
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
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Checkout konnte nicht erstellt werden' });
  }
}
