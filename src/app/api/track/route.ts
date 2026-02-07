import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type GeoData = {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
  org: string;
};

export async function POST(request: Request) {
  try {
    const { pathname, referrer, userAgent } = await request.json();

    // Get visitor IP from headers (Vercel sets these)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    // Skip tracking for localhost/development
    if (ip === "::1" || ip === "127.0.0.1") {
      return NextResponse.json({ success: true, skipped: true });
    }

    // Get geolocation data from free API
    let geo: GeoData | null = null;
    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: AbortSignal.timeout(3000),
      });
      if (geoRes.ok) {
        geo = await geoRes.json();
      }
    } catch {
      // Geolocation failed, continue without it
    }

    const location = geo
      ? `${geo.city || "Unknown city"}, ${geo.region || ""}, ${geo.country_name || "Unknown country"}`
      : "Could not determine location";

    const timestamp = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Snapping Turtle Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "eren.netic@gmail.com",
      subject: `🐢 Ny besökare: ${location}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background: #f0fdf4; border-radius: 12px;">
          <h2 style="color: #15803d; margin-top: 0;">🐢 Ny besökare på hemsidan</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">🕐 Tid</td>
              <td style="padding: 8px 0; color: #4b5563;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">🌐 IP-adress</td>
              <td style="padding: 8px 0; color: #4b5563;">${ip}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">📍 Plats</td>
              <td style="padding: 8px 0; color: #4b5563;">${location}</td>
            </tr>
            ${geo?.latitude ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">🗺️ Koordinater</td>
              <td style="padding: 8px 0; color: #4b5563;">${geo.latitude}, ${geo.longitude}</td>
            </tr>` : ""}
            ${geo?.org ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">🏢 ISP/Org</td>
              <td style="padding: 8px 0; color: #4b5563;">${geo.org}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">📄 Sida</td>
              <td style="padding: 8px 0; color: #4b5563;">${pathname || "/"}</td>
            </tr>
            ${referrer ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">🔗 Referrer</td>
              <td style="padding: 8px 0; color: #4b5563;">${referrer}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">💻 Enhet</td>
              <td style="padding: 8px 0; color: #4b5563; font-size: 12px;">${userAgent || "Unknown"}</td>
            </tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking error:", error);
    // Don't fail the page load if tracking fails
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
