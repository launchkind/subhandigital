import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { access_token } = await request.json()

    if (access_token && supabaseAdmin) {
      // Sign out from Supabase
      await supabaseAdmin.auth.signOut()
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    )
  }
}
