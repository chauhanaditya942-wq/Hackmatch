import { connectDB } from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { NextResponse } from 'next/server';
 
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const lead = await Lead.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, lead });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
 
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Lead.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
 