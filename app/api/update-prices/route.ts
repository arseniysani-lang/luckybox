import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'Prices updated via git push' });
}
