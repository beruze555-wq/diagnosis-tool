import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // service role key はサーバー側のみ（RLS バイパス）。未設定なら anon key にフォールバック
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !key) {
    return NextResponse.json(
      { error: 'Supabase environment variables are not configured' },
      { status: 500 },
    )
  }

  const supabase = createClient(supabaseUrl, key)

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { error } = await supabase.from('diagnosis_results').insert([body])

  if (error) {
    console.error('[save-diagnosis] Supabase insert error:', error)
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details },
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true })
}
