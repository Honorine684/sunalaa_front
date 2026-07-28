import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    const to = process.env.CONTACT_TO_EMAIL;
    if (!to) {
      return Response.json({ error: "Contact email not configured." }, { status: 500 });
    }

    await transporter.sendMail({
      from:    `"Sunalaa Contact" <${process.env.SMTP_USER}>`,
      to,
      replyTo: email,
      subject: `[Contact] ${subject} — ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="color:#1F4E46">New contact message</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#64748B;width:90px">Name</td><td style="padding:6px 0;font-weight:600">${name}</td></tr>
            <tr><td style="padding:6px 0;color:#64748B">Email</td><td style="padding:6px 0"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748B">Subject</td><td style="padding:6px 0">${subject}</td></tr>
          </table>
          <hr style="margin:16px 0;border:none;border-top:1px solid #E2E8F0"/>
          <p style="white-space:pre-wrap;color:#0F172B">${message.replace(/</g, "&lt;")}</p>
        </div>
      `,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact/route]", err);
    return Response.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
