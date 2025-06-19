import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    const apiKey = process.env.TAKEOFF_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }
    
    if (password === apiKey) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '잘못된 암호입니다.' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: '인증 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 