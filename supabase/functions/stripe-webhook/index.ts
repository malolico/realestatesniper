import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    if (body.type === 'checkout.session.completed') {
      const session = body.data.object
      const metadata = session.metadata || {}

      // NUEVO: deal_access (Premium / Diamond)
      if (metadata.checkout_type === 'deal_access') {
        const userId = metadata.user_id
        const dealId = metadata.deal_id
        const accessType = metadata.access_type
        const amountTotal = session.amount_total

        // Validaciones mínimas requeridas
        if (!userId || !dealId || !accessType) {
          console.error('deal_access metadata incompleta', {
            user_id: userId,
            deal_id: dealId,
            access_type: accessType,
          })

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        // Evitar duplicado
        const { data: existingPurchase, error: existingError } = await supabaseAdmin
          .from('deal_access_purchases')
          .select('id')
          .eq('user_id', userId)
          .eq('deal_id', dealId)
          .eq('access_type', accessType)
          .maybeSingle()

        if (existingError) {
          console.error('Error verificando compra existente', existingError)

          return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        if (!existingPurchase) {
          const amountUsd = typeof amountTotal === 'number' ? amountTotal / 100 : 0

          const { error: insertError } = await supabaseAdmin
            .from('deal_access_purchases')
            .insert({
              user_id: userId,
              deal_id: dealId,
              access_type: accessType,
              amount_usd: amountUsd,
            })

          if (insertError) {
            console.error('Error insertando deal_access_purchases', insertError)
          } else {
            if (accessType === 'premium_one_time') {
              console.log('Compra Premium guardada')
            } else if (accessType === 'platinum_one_time') {
              console.log('Compra Diamond guardada')
            }
          }
        }

        // IMPORTANTE: salir aquí para NO ejecutar rama de suscripción
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // LÓGICA ACTUAL DE SUSCRIPCIÓN (se mantiene)
      const userId = metadata.user_id || session.client_reference_id

      if (!userId) {
        console.error('No user_id found in subscription checkout session metadata')

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)

      if (userError || !userData?.user) {
        console.error('Error loading user for subscription activation', userError)

        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const currentMetadata = userData.user.user_metadata || {}

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          ...currentMetadata,
          subscription_active: true,
          access_role: currentMetadata.access_role || 'subscriber',
          subscriber_started_at: currentMetadata.subscriber_started_at || new Date().toISOString(),
        },
      })

      if (updateError) {
        console.error('Error updating subscription_active', updateError)
      } else {
        console.log(`Subscription activated for user ${userId}`)
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Webhook error:', error)

    // Mantener respuesta 200 para evitar reintentos agresivos mientras depuras
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})