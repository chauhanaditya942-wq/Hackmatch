import { connectDB } from '@/lib/mongodb';
import EstimateRequest from '@/models/EstimateRequest';
import Lead from '@/models/Lead';
import { sendLeadEmail } from '@/lib/mailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Estimate save karo
    const estimate = await EstimateRequest.create({
      name:         body.name,
      phone:        body.phone,
      roomType:     body.roomType,
      size:         body.size,
      quality:      body.quality,
      city:         body.city,
      workTypes:    body.workTypes,
      estimateLow:  body.estimateLow,
      estimateHigh: body.estimateHigh,
    });

    // Lead bhi save karo
    await Lead.create({
      name:    body.name,
      phone:   body.phone,
      email:   body.email,
      message: `Estimate request: ${body.roomType}, ${body.size} sqft, ${body.quality}`,
      source:  'Price Estimator',
      status:  'New',
    });

    // Email bhejo
    await sendLeadEmail({
      name:    body.name,
      phone:   body.phone,
      email:   body.email,
      message: `Estimate: ₹${body.estimateLow} – ₹${body.estimateHigh} | Room: ${body.roomType} | Size: ${body.size} sqft`,
    });

    return NextResponse.json({ success: true, estimate });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}