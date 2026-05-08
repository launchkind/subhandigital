import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Save booking data before payment
export async function POST(request) {
  try {
    const { orderId, bookingData } = await request.json()

    console.log("=== SAVING BOOKING DATA ===")
    console.log("Order ID:", orderId)
    console.log("Booking Data:", bookingData)

    if (!orderId || !bookingData) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Save booking with pending status
    const { data, error } = await supabaseAdmin
      .from("consultation_bookings")
      .insert([
        {
          full_name: bookingData.fullName,
          email: bookingData.email,
          mobile_number: bookingData.mobileNumber,
          business_idea: bookingData.businessIdea,
          short_description: bookingData.shortDescription,
          payment_amount: parseInt(bookingData.amount),
          payment_status: "pending",
          payment_gateway: "cashfree",
          cashfree_order_id: orderId,
          cashfree_payment_id: null,
          payment_method: "unknown",
          payment_date: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Save booking error:", error)
      throw error
    }

    console.log("Booking saved successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Booking data saved",
      booking: data[0],
    })
  } catch (error) {
    console.error("Save booking error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
