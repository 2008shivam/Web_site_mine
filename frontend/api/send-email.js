// Vercel Serverless Function - Resend Email API
// This file will be automatically deployed as /api/send-email

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { name, email, company, service_type, message } = req.body;

    // Validate required fields
    if (!name || !email || !service_type || !message) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields" 
      });
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

    // Get API key from environment variable (secure, server-side only)
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return res.status(500).json({ 
        success: false, 
        error: "Email service not configured" 
      });
    }

    // Send email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cyberent³ <onboarding@resend.dev>",
        to: ["jhashivam2008@gmail.com"],
        subject: `[Cyberent³] New Inquiry: ${serviceLabels[service_type] || service_type} - ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 30px; border: 1px solid #00FF94;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #00FF94; margin: 0;">Cyberent³</h1>
              <p style="color: #94A3B8; margin: 5px 0 0 0; font-size: 12px;">Exponential Security. Zero Compromise.</p>
            </div>
            
            <h2 style="color: #00FF94; border-bottom: 2px solid #00FF94; padding-bottom: 10px; margin-top: 0;">
              New Contact Form Submission
            </h2>
            
            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
              <tr>
                <td style="color: #94A3B8; padding: 12px 0; border-bottom: 1px solid #222; width: 120px;">Name:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #fff;">${name}</td>
              </tr>
              <tr>
                <td style="color: #94A3B8; padding: 12px 0; border-bottom: 1px solid #222;">Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222;"><a href="mailto:${email}" style="color: #00FF94; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="color: #94A3B8; padding: 12px 0; border-bottom: 1px solid #222;">Company:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #fff;">${company || "Not provided"}</td>
              </tr>
              <tr>
                <td style="color: #94A3B8; padding: 12px 0; border-bottom: 1px solid #222;">Service:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #222; color: #fff;">${serviceLabels[service_type] || service_type}</td>
              </tr>
            </table>
            
            <div style="margin-top: 25px; padding: 20px; background: #111; border-left: 3px solid #00FF94;">
              <p style="color: #94A3B8; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase;">Message:</p>
              <p style="margin: 0; color: #fff; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #222; text-align: center;">
              <p style="color: #475569; font-size: 11px; margin: 0;">
                Sent from Cyberent³ website contact form<br>
                ${new Date().toISOString()}
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error("Resend API error:", errorData);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to send email" 
      });
    }

    const result = await resendResponse.json();
    
    return res.status(200).json({ 
      success: true, 
      message: "Email sent successfully",
      id: result.id
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
}
