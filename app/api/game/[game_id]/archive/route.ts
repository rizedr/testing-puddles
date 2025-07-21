import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { game_id: string } }) {
    const { game_id } = params;
    // Adjust the backend URL as needed
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const url = `${backendUrl}/game/${game_id}/archive`;

    const backendRes = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Forward any auth headers if needed
        },
    });

    const data = await backendRes.text();
    if (!backendRes.ok) {
        let detail = data;
        try {
            const json = JSON.parse(data);
            detail = json.detail || data;
        } catch {}
        return NextResponse.json({ detail }, { status: backendRes.status });
    }
    return new NextResponse(data, { status: backendRes.status });
} 