import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    if (!userId) {
      console.error('Keine user_id in session metadata')
      return new Response('Missing user_id', { status: 400 })
    }

    // Idempotenz: Prüfe ob diese Session bereits verarbeitet wurde
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('stripe_session_id, membership_status')
      .eq('id', userId)
      .single()

    if (existingProfile?.stripe_session_id === session.id) {
      console.log(`Session ${session.id} bereits verarbeitet, überspringe`)
      return new Response(JSON.stringify({ received: true, skipped: true }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Zertifikatsnummer server-seitig generieren
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 90000 + 10000)
    const certificateNumber = `DC-${year}-${random}`

    // Mitgliedschaft aktivieren (service_role umgeht RLS + Trigger erkennt service_role)
    const { error } = await supabase
      .from('profiles')
      .update({
        membership_status: 'active',
        paid_at: new Date().toISOString(),
        paid_amount: (session.amount_total || 24900) / 100,
        access_granted_at: new Date().toISOString(),
        stripe_session_id: session.id,
        stripe_customer_id: session.customer,
        certificate_number: existingProfile?.membership_status === 'pending'
          ? certificateNumber
          : undefined, // Behalte bestehende Nummer bei Reaktivierung
      })
      .eq('id', userId)

    if (error) {
      console.error('Profil-Update fehlgeschlagen:', error)
      return new Response('Database error', { status: 500 })
    }

    console.log(`Mitgliedschaft aktiviert für User: ${userId}`)
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
