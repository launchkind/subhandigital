import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { orderId, bookingData } = await request.json()

    console.log("Creating pending booking for order:", orderId)

    // Store booking with pending status
    const { data, error } = await supabaseAdmin
      .from("consultation_bookings")
      .insert([{
        full_name: bookingData.fullName,
        email: bookingData.email,
        mobile_number: bookingData.mobileNumber,
        business_idea: bookingData.businessIdea,
        short_description: bookingData.shortDescription,
        payment_amount: parseInt(bookingData.amount),
        payment_status: "pending",
        payment_gateway: "cashfree",
        cashfree_order_id: orderId,
        payment_date: new Date().toISOString(),
      }])
      .select()

    if (error) {
      console.error("Error creating pending booking:", error)
      throw error
    }

    console.log("Pending booking created:", data)

    return NextResponse.json({
      success: true,
      booking: data[0]
    })
  } catch (error) {
    console.error("Create pending booking error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
