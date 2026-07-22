import "@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const OFFICIAL_EMAIL = "aectsd2027@srec.ac.in";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Support both Supabase Webhook payload (record) or direct invocation payload
    const record = body.record || body;
    const senderName = record.name || "Website Visitor";
    const senderEmail = record.email || "No email provided";
    const emailSubject = record.subject || "New Contact Inquiry - AECTSD 2027";
    const emailMessage = record.message || "";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #092147; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0; color: #ffffff;">AECTSD 2027 Inquiry Notification</h2>
          <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">Sri Ramakrishna Engineering College</p>
        </div>
        <div style="padding: 24px; color: #334155; background-color: #ffffff;">
          <p style="margin: 0 0 10px;"><strong>Name:</strong> ${senderName}</p>
          <p style="margin: 0 0 10px;"><strong>Sender Email:</strong> <a href="mailto:${senderEmail}">${senderEmail}</a></p>
          <p style="margin: 0 0 10px;"><strong>Subject:</strong> ${emailSubject}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <h4 style="margin: 0 0 10px; color: #092147;">Message Details:</h4>
          <p style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 6px; border: 1px solid #cbd5e1; margin: 0;">${emailMessage}</p>
        </div>
      </div>
    `;

    // 1. Send via Resend if RESEND_API_KEY environment variable is configured
    if (RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "AECTSD 2027 Portal <onboarding@resend.dev>",
          to: [OFFICIAL_EMAIL],
          subject: `[AECTSD 2027] ${emailSubject}`,
          html: htmlContent,
          reply_to: senderEmail,
        }),
      });

      const data = await res.json();
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // 2. Fallback response if RESEND_API_KEY is not yet configured in Supabase secrets
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message processed by Edge Function. To send live emails, set RESEND_API_KEY in Supabase secrets.",
        details: { senderName, senderEmail, emailSubject, recipient: OFFICIAL_EMAIL },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
