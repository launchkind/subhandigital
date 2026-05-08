import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { access_token } = await request.json()

    if (!access_token || !supabaseAdmin) {
      return NextResponse.json({ authenticated: false })
    }

    // Verify the token with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(access_token)

    if (error || !data.user) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
      authenticated: true,
      user: data.user
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false })
  }
}
