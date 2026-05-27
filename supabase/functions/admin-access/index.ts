import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const ADMIN_EMAILS = ['founder@realestatesniper.io']

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      return jsonResponse({ error: 'Missing Authorization' }, 401)
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    const {
      data: { user },
    } = await supabaseUser.auth.getUser()

    if (!user) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const email = normalizeEmail(user.email || '')

    if (!ADMIN_EMAILS.includes(email)) {
      return jsonResponse({ error: 'Forbidden' }, 403)
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const body = await req.json()
    const action = body?.action
    const userId = body?.user_id

    // =========================
    // LIST USERS
    // =========================
    if (action === 'list_requests') {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers()

      if (error) {
        return jsonResponse({ error: error.message }, 500)
      }

      const { data: purchases, error: purchasesError } = await supabaseAdmin
        .from('deal_access_purchases')
        .select('user_id, access_type')

      if (purchasesError) {
        return jsonResponse({ error: purchasesError.message }, 500)
      }

      const purchaseCounts = new Map()

      ;(purchases || []).forEach((purchase: any) => {
        if (!purchase.user_id) return

        if (!purchaseCounts.has(purchase.user_id)) {
          purchaseCounts.set(purchase.user_id, {
            premium: 0,
            diamond: 0,
          })
        }

        const counts = purchaseCounts.get(purchase.user_id)

        if (purchase.access_type === 'premium_one_time') {
          counts.premium += 1
        }

        if (purchase.access_type === 'platinum_one_time') {
          counts.diamond += 1
        }
      })

      const users = (data.users || []).map((u: any) => {
        const meta = u.user_metadata || {}
        const counts = purchaseCounts.get(u.id) || {
          premium: 0,
          diamond: 0,
        }

        return {
          id: u.id,
          email: u.email,
          access_role: meta.access_role || 'standard',
          subscription_active: meta.subscription_active === true,
          founder_trial_status: meta.founder_trial_status || null,
          premium_purchase_count: counts.premium,
          diamond_purchase_count: counts.diamond,
        }
      })

      return jsonResponse({ users })
    }

    // =========================
    // APPROVE / REJECT / REVOKE
    // =========================

    if (!userId) {
      return jsonResponse({ error: 'Missing user_id' }, 400)
    }

    const { data: targetData } =
      await supabaseAdmin.auth.admin.getUserById(userId)

    const currentMeta = targetData.user.user_metadata || {}
    let newMeta = { ...currentMeta }

    // ---- PREMIUM ----
    if (action === 'approve_premium') {
      newMeta.premium_access = true
      newMeta.premium_request_status = 'approved'
    }

    if (action === 'reject_premium') {
      newMeta.premium_access = false
      newMeta.premium_request_status = 'rejected'
    }

    if (action === 'revoke_premium') {
      newMeta.premium_access = false
      newMeta.premium_request_status = 'revoked'
    }

    // ---- DIAMOND ----
    if (action === 'approve_diamond') {
      newMeta.diamond_access = true
      newMeta.diamond_request_status = 'approved'
    }

    if (action === 'reject_diamond') {
      newMeta.diamond_access = false
      newMeta.diamond_request_status = 'rejected'
    }

    if (action === 'revoke_diamond') {
      newMeta.diamond_access = false
      newMeta.diamond_request_status = 'revoked'
    }

    const { data, error } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: newMeta,
      })

    if (error) {
      return jsonResponse({ error: error.message }, 500)
    }

    return jsonResponse({ success: true, user: data.user })
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500)
  }
})