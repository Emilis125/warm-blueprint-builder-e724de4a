import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const VAPID_PUBLIC_KEY = 'BFvPFieasRoGbMtZOCeK5D_8msAn-GUR6xLgj2CbUmfFIVnr_q54BjcQIiGzshHns0aSimAUjUwetomkEm-hsEA';

// Web Push signing utilities
async function generateVapidHeaders(endpoint: string, vapidPublicKey: string, vapidPrivateKey: string) {
  const urlObj = new URL(endpoint);
  const audience = `${urlObj.protocol}//${urlObj.host}`;

  // Create JWT
  const header = { typ: 'JWT', alg: 'ES256' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: audience,
    exp: now + 12 * 3600,
    sub: 'mailto:ejgroup0@gmail.com',
  };

  const headerB64 = btoa(JSON.stringify(header)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key
  const privateKeyBytes = Uint8Array.from(atob(vapidPrivateKey.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    privateKeyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  // Convert DER to raw format if needed
  const sig = new Uint8Array(signatureBuffer);
  let r: Uint8Array, s: Uint8Array;
  
  if (sig.length === 64) {
    r = sig.slice(0, 32);
    s = sig.slice(32, 64);
  } else {
    // DER format
    const rLen = sig[3];
    const rStart = 4;
    const rBytes = sig.slice(rStart, rStart + rLen);
    const sLen = sig[rStart + rLen + 1];
    const sStart = rStart + rLen + 2;
    const sBytes = sig.slice(sStart, sStart + sLen);
    
    r = rBytes.length > 32 ? rBytes.slice(rBytes.length - 32) : rBytes;
    s = sBytes.length > 32 ? sBytes.slice(sBytes.length - 32) : sBytes;
    
    if (r.length < 32) {
      const padded = new Uint8Array(32);
      padded.set(r, 32 - r.length);
      r = padded;
    }
    if (s.length < 32) {
      const padded = new Uint8Array(32);
      padded.set(s, 32 - s.length);
      s = padded;
    }
  }

  const rawSig = new Uint8Array(64);
  rawSig.set(r, 0);
  rawSig.set(s, 32);

  const signatureB64 = btoa(String.fromCharCode(...rawSig)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const jwt = `${unsignedToken}.${signatureB64}`;

  // Decode public key for p256ecdsa
  const pubKeyBytes = Uint8Array.from(atob(vapidPublicKey.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const p256ecdsa = btoa(String.fromCharCode(...pubKeyBytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return {
    Authorization: `vapid t=${jwt}, k=${p256ecdsa}`,
  };
}

async function sendPushNotification(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: object,
  vapidPrivateKey: string
) {
  const headers = await generateVapidHeaders(subscription.endpoint, VAPID_PUBLIC_KEY, vapidPrivateKey);

  const body = JSON.stringify(payload);

  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'TTL': '86400',
    },
    body,
  });

  return response;
}

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get current time in all relevant timezones
    const now = new Date();

    // Query all enabled notification preferences
    const { data: prefs, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('enabled', true)
      .not('push_subscription', 'is', null);

    if (error) {
      console.error('Error fetching preferences:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let sent = 0;
    let errors = 0;

    for (const pref of (prefs || [])) {
      try {
        // Calculate user's current time in their timezone
        const userTime = new Date(now.toLocaleString('en-US', { timeZone: pref.timezone }));
        const userHour = userTime.getHours().toString().padStart(2, '0');
        const userMinute = userTime.getMinutes();
        // Round to nearest 15-minute window
        const roundedMinute = Math.floor(userMinute / 15) * 15;
        const userTimeStr = `${userHour}:${roundedMinute.toString().padStart(2, '0')}`;

        // Check if reminder_time matches current 15-minute window
        const [targetH, targetM] = pref.reminder_time.split(':').map(Number);
        const targetRounded = `${targetH.toString().padStart(2, '0')}:${(Math.floor(targetM / 15) * 15).toString().padStart(2, '0')}`;

        if (userTimeStr !== targetRounded) {
          continue;
        }

        const subscription = pref.push_subscription;
        if (!subscription?.endpoint || !subscription?.keys) {
          continue;
        }

        const response = await sendPushNotification(
          subscription,
          {
            title: 'TipTracker Pro',
            body: "Don't forget to log your tips! 💰",
            icon: '/icon-192.png',
          },
          vapidPrivateKey
        );

        if (response.ok || response.status === 201) {
          sent++;
        } else {
          console.error(`Push failed for user ${pref.user_id}: ${response.status} ${await response.text()}`);
          errors++;

          // If subscription is invalid (410 Gone), remove it
          if (response.status === 404 || response.status === 410) {
            await supabase
              .from('notification_preferences')
              .update({ enabled: false, push_subscription: null })
              .eq('id', pref.id);
          }
        }
      } catch (e) {
        console.error(`Error processing user ${pref.user_id}:`, e);
        errors++;
      }
    }

    console.log(`Notifications sent: ${sent}, errors: ${errors}, total checked: ${prefs?.length || 0}`);

    return new Response(
      JSON.stringify({ success: true, sent, errors, checked: prefs?.length || 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
