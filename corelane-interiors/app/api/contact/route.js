import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { sendLeadEmail } from '@/lib/mailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    const lead = await Lead.create({
      name:    body.name,
      phone:   body.phone,
      email:   body.email,
      message: body.message,
      source:  'Contact Form',
      status:  'New',
    });

    await sendLeadEmail(body);

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}