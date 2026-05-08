import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderId } = body

    console.log("=== PAYMENT VERIFICATION STARTED ===")
    console.log("Order ID:", orderId)

    // Validate input
    if (!orderId) {
      console.error("Missing order ID")
      return NextResponse.json(
        { success: false, error: "Missing order ID" },
        { status: 400 }
      )
    }

    // Validate Cashfree credentials
    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      console.error("Cashfree credentials missing")
      return NextResponse.json(
        { success: false, error: "Cashfree credentials not configured" },
        { status: 500 }
      )
    }

    // Check if booking exists
    const { data: existingBooking, error: fetchError } = await supabaseAdmin
      .from("consultation_bookings")
      .select("*")
      .eq("cashfree_order_id", orderId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Database fetch error:", fetchError)
      throw fetchError
    }

    if (!existingBooking) {
      console.error("No booking found for order:", orderId)
      return NextResponse.json(
        { success: false, error: "Booking not found. Please contact support." },
        { status: 404 }
      )
    }

    console.log("Found existing booking:", existingBooking)

    // If already paid, return success
    if (existingBooking.payment_status === "paid") {
      console.log("Booking already marked as paid")
      return NextResponse.json({
        success: true,
        message: "Booking already verified",
        booking: existingBooking,
      })
    }

    // Fetch order details from Cashfree
    const apiUrl = process.env.CASHFREE_ENV === "production"
      ? `https://api.cashfree.com/pg/orders/${orderId}`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}`

    console.log("Fetching order from Cashfree:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
    })

    const orderData = await response.json()
    console.log("Cashfree order response:", orderData)

    if (!response.ok) {
      console.error("Cashfree order fetch error:", {
        status: response.status,
        data: orderData,
      })
      return NextResponse.json(
        { success: false, error: orderData.message || "Failed to fetch order" },
        { status: response.status }
      )
    }

    // Check if payment is successful
    if (orderData.order_status !== "PAID") {
      console.error("Payment not completed:", orderData.order_status)
      return NextResponse.json(
        { success: false, error: `Payment ${orderData.order_status.toLowerCase()}` },
        { status: 400 }
      )
    }

    console.log("Payment verified as PAID")

    // Fetch payment details
    const paymentsUrl = process.env.CASHFREE_ENV === "production"
      ? `https://api.cashfree.com/pg/orders/${orderId}/payments`
      : `https://sandbox.cashfree.com/pg/orders/${orderId}/payments`

    const paymentsResponse = await fetch(paymentsUrl, {
      method: "GET",
      headers: {
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
    })

    const paymentsData = await paymentsResponse.json()
    const payment = paymentsData[0] || {}
    console.log("Payment details:", payment)

    // Update booking status to paid
    const { data: updatedBooking, error: updateError } = await supabaseAdmin
      .from("consultation_bookings")
      .update({
        payment_status: "paid",
        cashfree_payment_id: payment.cf_payment_id || null,
        payment_method: payment.payment_group || "unknown",
        updated_at: new Date().toISOString(),
      })
      .eq("cashfree_order_id", orderId)
      .select()

    if (updateError) {
      console.error("Update error:", updateError)
      throw updateError
    }

    console.log("Booking updated successfully:", updatedBooking)
    console.log("=== PAYMENT VERIFICATION COMPLETED ===")

    return NextResponse.json({
      success: true,
      message: "Payment verified and booking updated",
      booking: updatedBooking[0],
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify payment" },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  )
}
