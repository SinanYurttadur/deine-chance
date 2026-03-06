import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Vercel: Raw body für Stripe Signature Verification
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing signature' });
  }

  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const userId = session.metadata?.user_id;
    if (!userId) {
      console.error('Keine user_id in session metadata');
      return res.status(400).json({ error: 'Missing user_id' });
    }

    // Idempotenz: Prüfe ob diese Session bereits verarbeitet wurde
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('stripe_session_id, membership_status')
      .eq('id', userId)
      .single();

    if (existingProfile?.stripe_session_id === session.id) {
      console.log(`Session ${session.id} bereits verarbeitet, überspringe`);
      return res.status(200).json({ received: true, skipped: true });
    }

    // Zertifikatsnummer server-seitig generieren
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 90000 + 10000);
    const certificateNumber = `DC-${year}-${random}`;

    // Mitgliedschaft aktivieren (service_role umgeht RLS, Trigger erkennt service_role)
    const updateData = {
      membership_status: 'active',
      paid_at: new Date().toISOString(),
      paid_amount: (session.amount_total ?? 24900) / 100,
      access_granted_at: new Date().toISOString(),
      stripe_session_id: session.id,
    };

    // stripe_customer_id nur setzen wenn vorhanden (bei 100%-Gutschein ist customer null)
    if (session.customer) {
      updateData.stripe_customer_id = session.customer;
    }

    // Subscription-ID speichern (für Kündigung via Stripe API)
    if (session.subscription) {
      updateData.stripe_subscription_id = session.subscription;
    }

    // Nur bei Erst-Aktivierung Zertifikatsnummer setzen
    if (existingProfile?.membership_status === 'pending' || !existingProfile?.membership_status) {
      updateData.certificate_number = certificateNumber;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Profil-Update fehlgeschlagen:', JSON.stringify(error));
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    console.log(`Mitgliedschaft aktiviert für User: ${userId}`);
  }

  // Subscription beendet (Laufzeit abgelaufen oder sofort gekündigt)
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;

    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id, membership_status')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (findError || !profile) {
      console.error('Kein Profil für Subscription gefunden:', subscription.id);
      return res.status(200).json({ received: true, warning: 'No profile found' });
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        membership_status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (error) {
      console.error('Kündigung-Update fehlgeschlagen:', JSON.stringify(error));
      return res.status(500).json({ error: 'Database error', details: error.message });
    }

    console.log(`Subscription beendet für User: ${profile.id}`);
  }

  // Zahlung fehlgeschlagen (Stripe hat Smart Retries eingebaut)
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object;
    console.warn('Zahlung fehlgeschlagen für Subscription:', invoice.subscription, 'Customer:', invoice.customer);
  }

  return res.status(200).json({ received: true });
}
