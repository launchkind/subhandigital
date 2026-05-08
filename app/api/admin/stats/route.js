import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { access_token } = await request.json()

    if (!access_token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify the token using regular client
    const { data: userData, error: authError } = await supabase.auth.getUser(access_token)

    if (authError || !userData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("Fetching bookings from database...")

    // Fetch all bookings (RLS is disabled, so regular client works)
    const { data: bookings, error } = await supabase
      .from("consultation_bookings")
      .select("*")
      .eq("payment_status", "paid")
      .order("payment_date", { ascending: false })

    if (error) {
      console.error("Database fetch error:", error)
      throw error
    }

    console.log(`Found ${bookings?.length || 0} bookings`)

    // Calculate stats
    const totalLeads = bookings?.length || 0
    const totalAmount = bookings?.reduce((sum, booking) => sum + (booking.payment_amount || 0), 0) || 0
    const recentBookings = bookings || []

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        totalAmount,
        recentBookings
      }
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
