import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

// CORS: Nur eigene Domain erlauben (anpassen vor Go-Live)
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://deinechance24.org'

const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Auth-Token prüfen
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Nicht autorisiert' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // URLs server-seitig definieren – keine Open Redirects möglich
    const siteUrl = Deno.env.get('SITE_URL') || 'https://deinechance24.org'

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
            unit_amount: 24900, // 249€ – nur hier definiert, nicht manipulierbar
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/willkommen?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
    })

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return new Response(JSON.stringify({ error: 'Checkout konnte nicht erstellt werden' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
