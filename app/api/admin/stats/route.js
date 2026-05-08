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

    // Verify the token
    const { data: userData, error: authError } = await supabase.auth.getUser(access_token)

    if (authError || !userData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch all bookings
    const { data: bookings, error } = await supabase
      .from("consultation_bookings")
      .select("*")
      .eq("payment_status", "paid")
      .order("payment_date", { ascending: false })

    if (error) {
      throw error
    }

    // Calculate stats
    const totalLeads = bookings?.length || 0
    const totalAmount = bookings?.reduce((sum, booking) => sum + (booking.payment_amount || 0), 0) || 0
    const recentBookings = bookings?.slice(0, 10) || []

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
