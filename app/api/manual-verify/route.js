import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Manual verification endpoint for when callback fails
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("order_id")

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID required" },
        { status: 400 }
      )
    }

    console.log("Manual verification for order:", orderId)

    // Check if already saved
    const { data: existing } = await supabaseAdmin
      .from("consultation_bookings")
      .select("*")
      .eq("cashfree_order_id", orderId)
      .single()

    if (existing) {
      console.log("Booking already exists:", existing)
      return NextResponse.json({
        success: true,
        message: "Booking already saved",
        booking: existing,
        alreadyExists: true
      })
    }

    // Fetch order from Cashfree
    const apiUrl = process.env.CASHFREE_ENV === "production"
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
    })

    const orderData = await response.json()

    if (!response.ok || orderData.order_status !== "PAID") {
      return NextResponse.json({
        success: false,
        error: "Payment not completed",
        status: orderData.order_status
      })
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified but booking data missing. Please contact support.",
      orderStatus: orderData.order_status,
      orderId: orderId,
      needsManualEntry: true
    })
  } catch (error) {
    console.error("Manual verification error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
