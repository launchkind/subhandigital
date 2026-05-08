import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("API: Fetching booking price from database...")
    
    // Fetch booking price from database
    const { data: settings, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "booking_price")
      .single()

    console.log("API: Database response:", { settings, error })

    if (error && error.code !== "PGRST116") {
      console.error("API: Database error:", error)
      throw error
    }

    const bookingPrice = settings?.value || 999
    console.log("API: Returning booking price:", bookingPrice)

    return NextResponse.json({
      success: true,
      bookingPrice: bookingPrice
    })
  } catch (error) {
    console.error("Booking price fetch error:", error)
    return NextResponse.json(
      { success: true, bookingPrice: 999 }
    )
  }
}
