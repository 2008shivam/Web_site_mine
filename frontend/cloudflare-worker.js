// Cloudflare Worker - Resend Email Proxy
// Deploy this to Cloudflare Workers (free tier)
// URL will be like: https://cyberent-email.YOUR_SUBDOMAIN.workers.dev

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const body = await request.json();
      const { name, email, company, service_type, message } = body;

      // Validate required fields
      if (!name || !email || !service_type || !message) {
        return new Response(
          JSON.stringify({ success: false, error: "Missing required fields" }),
          { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      }

      // Service type labels
      const serviceLabels = {
        web: "Web Application VAPT",
        mobile: "Mobile Application VAPT",
        network: "Infrastructure/Network VAPT",
        thick: "Thick Client VAPT",
        api: "API Security Testing",
        grc: "GRC Auditing",
        multiple: "Multiple Services"
      };

      // Send email via Resend
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Cyberent³ <onboarding@resend.dev>",
          to: ["jhashivam2008@gmail.com"],
          subject: `[Cyberent³] New Inquiry: ${serviceLabels[service_type] || service_type} - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px;">
              <h1 style="color: #00FF94; border-bottom: 2px solid #00FF94; padding-bottom: 10px;">New Contact Form Submission</h1>
              <table style="width: 100%; margin-top: 20px;">
                <tr><td style="color: #94A3B8; padding: 10px 0;">Name:</td><td style="padding: 10px 0;">${name}</td></tr>
                <tr><td style="color: #94A3B8; padding: 10px 0;">Email:</td><td style="padding: 10px 0; color: #00FF94;">${email}</td></tr>
                <tr><td style="color: #94A3B8; padding: 10px 0;">Company:</td><td style="padding: 10px 0;">${company || "Not provided"}</td></tr>
                <tr><td style="color: #94A3B8; padding: 10px 0;">Service:</td><td style="padding: 10px 0;">${serviceLabels[service_type] || service_type}</td></tr>
              </table>
              <div style="margin-top: 20px; padding: 15px; background: #111; border-left: 3px solid #00FF94;">
                <p style="color: #94A3B8; margin: 0 0 10px 0;">Message:</p>
                <p style="margin: 0;">${message}</p>
              </div>
              <p style="color: #475569; font-size: 12px; margin-top: 30px;">Sent from Cyberent³ website contact form</p>
            </div>
          `,
        }),
      });

      if (!resendResponse.ok) {
        const error = await resendResponse.text();
        console.error("Resend error:", error);
        return new Response(
          JSON.stringify({ success: false, error: "Failed to send email" }),
          { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );

    } catch (error) {
      console.error("Worker error:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Server error" }),
        { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
      );
    }
  },
};
