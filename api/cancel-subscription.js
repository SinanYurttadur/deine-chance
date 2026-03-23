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

  // CSRF: Reject requests from unknown origins
  if (!allowedOrigins.includes(origin) && origin !== '') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Env-Vars fehlen für cancel-subscription');
    return res.status(500).json({ error: 'Server-Konfiguration unvollständig.' });
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
      return res.status(401).json({ error: 'Sitzung ungültig. Bitte erneut anmelden.' });
    }

    // Subscription-ID aus Profil laden
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_subscription_id, membership_status')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Profil nicht gefunden.' });
    }

    if (profile.membership_status !== 'active') {
      return res.status(400).json({ error: 'Keine aktive Mitgliedschaft vorhanden.' });
    }

    // Bestehende Mitglieder ohne Subscription-ID (vor Abo-Umstellung)
    if (!profile.stripe_subscription_id) {
      return res.status(400).json({
        error: 'Deine Mitgliedschaft kann nicht automatisch gekündigt werden. Bitte kontaktiere deinechance@mail.de',
      });
    }

    const { reason } = req.body || {};

    // Abo zum Laufzeitende kündigen (nicht sofort)
    await stripe.subscriptions.update(profile.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Kündigungsgrund in DB speichern (membership_status bleibt 'active' bis Webhook)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason || null,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Kündigungsgrund speichern fehlgeschlagen:', updateError);
      // Nicht kritisch – Stripe-Kündigung war erfolgreich
    }

    console.log(`Abo-Kündigung eingeleitet für User: ${user.id}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Cancel-subscription error:', err.message);

    if (err.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'Abo konnte nicht gekündigt werden. Bitte kontaktiere deinechance@mail.de' });
    }

    return res.status(500).json({
      error: 'Kündigung fehlgeschlagen. Bitte versuche es erneut oder kontaktiere deinechance@mail.de',
    });
  }
}
