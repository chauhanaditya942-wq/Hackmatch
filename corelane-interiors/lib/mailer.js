import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendLeadEmail({ name, phone, email, message }) {
  await transporter.sendMail({
    from: `"Core Lane Interiors" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `🏠 New Lead: ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #eee;border-radius:8px;">
        <h2 style="color:#C94F2C;">New Enquiry — Core Lane Interiors</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email || 'Not provided'}</p>
        <p><b>Message:</b> ${message || 'No message'}</p>
        <hr/>
        <p style="color:#999;font-size:12px;">Sent from corelaneinteriors.com</p>
      </div>
    `,
  });
}

export async function sendGuideEmail({ name, email }) {
  await transporter.sendMail({
    from: `"Core Lane Interiors" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '🏠 Your Free Home Interior Guide — Core Lane Interiors',
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:32px;border:1px solid #eee;border-radius:8px;">
        <h2 style="color:#C94F2C;">Hi ${name}! 👋</h2>
        <p>Thank you for your interest in Core Lane Interiors.</p>
        <p>Here is your free Home Interior Guide:</p>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/guide.pdf" 
           style="display:inline-block;background:#C94F2C;color:white;padding:12px 28px;border-radius:4px;text-decoration:none;font-weight:600;margin:16px 0;">
          Download Guide →
        </a>
        <p>Feel free to reach out anytime!</p>
        <p>— Vinod Chauhan<br/>Core Lane Interiors, Ghaziabad</p>
      </div>
    `,
  });
}