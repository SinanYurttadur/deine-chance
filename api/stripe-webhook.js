import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
      paid_amount: (session.amount_total || 24900) / 100,
      access_granted_at: new Date().toISOString(),
      stripe_session_id: session.id,
      stripe_customer_id: session.customer,
    };

    // Nur bei Erst-Aktivierung Zertifikatsnummer setzen
    if (existingProfile?.membership_status === 'pending' || !existingProfile?.membership_status) {
      updateData.certificate_number = certificateNumber;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Profil-Update fehlgeschlagen:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log(`Mitgliedschaft aktiviert für User: ${userId}`);
  }

  return res.status(200).json({ received: true });
}
