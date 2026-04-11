import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { tips } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build a summary of the user's tip data for the AI
    const totalTips = tips.length;
    const totalEarned = tips.reduce((s: number, t: any) => s + t.amount, 0);
    const cashTotal = tips.reduce((s: number, t: any) => s + t.cashAmount, 0);
    const cardTotal = tips.reduce((s: number, t: any) => s + t.cardAmount, 0);

    // Shift breakdown
    const shiftCounts: Record<string, { total: number; count: number }> = {};
    tips.forEach((t: any) => {
      if (!shiftCounts[t.shift]) shiftCounts[t.shift] = { total: 0, count: 0 };
      shiftCounts[t.shift].total += t.amount;
      shiftCounts[t.shift].count++;
    });

    // Day of week breakdown
    const dayTotals: Record<string, { total: number; count: number }> = {};
    tips.forEach((t: any) => {
      const day = new Date(t.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayTotals[day]) dayTotals[day] = { total: 0, count: 0 };
      dayTotals[day].total += t.amount;
      dayTotals[day].count++;
    });

    const summary = `
Tip data summary for a hospitality worker:
- Total entries: ${totalTips}
- Total earned: $${totalEarned.toFixed(2)}
- Cash: $${cashTotal.toFixed(2)} (${Math.round((cashTotal / totalEarned) * 100)}%)
- Card: $${cardTotal.toFixed(2)} (${Math.round((cardTotal / totalEarned) * 100)}%)

Shift breakdown:
${Object.entries(shiftCounts).map(([s, d]) => `- ${s}: $${d.total.toFixed(2)} across ${d.count} shifts (avg $${(d.total / d.count).toFixed(2)})`).join('\n')}

Day of week breakdown:
${Object.entries(dayTotals).map(([d, v]) => `- ${d}: $${v.total.toFixed(2)} across ${v.count} days (avg $${(v.total / v.count).toFixed(2)})`).join('\n')}

Workplaces: ${[...new Set(tips.map((t: any) => t.workplace))].join(', ')}
    `.trim();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a tip earnings advisor for hospitality workers. Analyze the data and provide exactly 4 actionable insights as a JSON array. Each insight should have: "title" (short, catchy), "body" (2-3 sentences of actionable advice), "type" (one of: "earning", "shift", "projection", "tax"). Be specific with numbers from the data. Focus on: 1) Best earning patterns 2) Shift optimization 3) Income projections 4) Tax tips. Return ONLY the JSON array, no markdown.`
          },
          { role: "user", content: summary }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "[]";

    // Try to parse JSON from the response
    let insights;
    try {
      // Remove markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      insights = JSON.parse(cleaned);
    } catch {
      insights = [
        { title: "Keep logging!", body: "Continue tracking your tips to get personalized AI insights.", type: "earning" }
      ];
    }

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
