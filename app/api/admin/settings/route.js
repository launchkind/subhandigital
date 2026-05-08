import { NextResponse } from "next/server"
import { supabase, supabaseAdmin } from "@/lib/supabase"

// Get settings (public endpoint - no auth needed)
export async function GET(request) {
  try {
    // Fetch settings from database
    const { data: settings, error } = await supabase
      .from("app_settings")
      .select("*")
      .eq("key", "booking_price")
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Settings fetch error:", error)
      throw error
    }

    console.log("Fetched settings:", settings)

    return NextResponse.json({
      success: true,
      settings: {
        bookingPrice: settings?.value || 999
      }
    })
  } catch (error) {
    console.error("Settings fetch error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

// Update settings
export async function POST(request) {
  try {
    const { access_token, bookingPrice } = await request.json()

    if (!access_token || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify the token
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(access_token)

    if (authError || !userData.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Validate price
    if (!bookingPrice || bookingPrice < 1) {
      return NextResponse.json(
        { success: false, error: "Invalid price" },
        { status: 400 }
      )
    }

    console.log("Updating booking price to:", bookingPrice)

    // Update or insert settings
    const { data, error } = await supabaseAdmin
      .from("app_settings")
      .upsert({
        key: "booking_price",
        value: parseInt(bookingPrice),
        updated_at: new Date().toISOString()
      }, {
        onConflict: "key"
      })
      .select()

    if (error) {
      console.error("Update error:", error)
      throw error
    }

    console.log("Update result:", data)

    return NextResponse.json({
      success: true,
      message: "Booking price updated successfully",
      newPrice: parseInt(bookingPrice)
    })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    )
  }
}
