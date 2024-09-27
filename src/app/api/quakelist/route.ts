import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://quakelist.net/api/full');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Quake Live servers:', error);
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 });
  }
}
