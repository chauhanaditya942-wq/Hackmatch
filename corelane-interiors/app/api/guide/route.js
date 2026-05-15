import { connectDB } from '@/lib/mongodb';
import GuideDownload from '@/models/GuideDownload';
import Lead from '@/models/Lead';
import { sendGuideEmail } from '@/lib/mailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    await GuideDownload.create({ name: body.name, email: body.email });

    await Lead.create({
      name:   body.name,
      email:  body.email,
      source: 'Guide Download',
      status: 'New',
    });

    await sendGuideEmail(body);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}