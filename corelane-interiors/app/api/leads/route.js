import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { sendLeadEmail } from '@/lib/mailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const lead = await Lead.create(body);
    await sendLeadEmail(body);
    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const leads = await Lead.find().sort({ createdAt: -1 });
    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}