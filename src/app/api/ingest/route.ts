import { NextResponse } from 'next/server';
import { ingestFeeds } from '@/lib/ingest';

export async function GET() {
  try {
    await ingestFeeds();
    return NextResponse.json({ success: true, message: 'Ingestion completed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
