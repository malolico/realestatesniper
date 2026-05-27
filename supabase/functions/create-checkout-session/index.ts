import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

// ✅ CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // ✅ Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 🔥 CAMBIO 1 (añadido deal_id)
    const { type, deal_id } = await req.json();

    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '').trim();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { data: userData, error: userError } =
      await supabase.auth.getUser(token);

    const user = userData?.user;

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const success_url = 'http://localhost:5173?success=true';
    const cancel_url = 'http://localhost:5173?canceled=true';

    let session;

    // 💰 SUSCRIPCIÓN (NO TOCAR)
    if (type === 'subscription') {
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'RealEstateSniper Subscription',
              },
              unit_amount: 150000,
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        success_url,
        cancel_url,
        client_reference_id: user.id,
        customer_email: user.email ?? undefined,
        metadata: {
          supabase_user_id: user.id,
          checkout_type: type ?? 'subscription',
        },
      });
    }

    // 💎 PREMIUM / DIAMOND
    if (type === 'premium' || type === 'diamond') {
      const price = type === 'diamond' ? 750000 : 450000;

      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name:
                  type === 'diamond'
                    ? 'Diamond Access'
                    : 'Premium Access',
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],

        // 🔥 CAMBIO 2 (CLAVE)
        client_reference_id: user.id,
        customer_email: user.email ?? undefined,
        metadata: {
          checkout_type: 'deal_access',
          user_id: user.id,
          deal_id,
          access_type:
            type === 'diamond'
              ? 'platinum_one_time'
              : 'premium_one_time',
        },

        success_url,
        cancel_url,
      });
    }

    return new Response(
      JSON.stringify({ url: session?.url }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});