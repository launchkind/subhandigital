import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderId, bookingData } = body

    console.log("=== PAYMENT VERIFICATION STARTED ===")
    console.log("Order ID:", orderId)
    console.log("Booking Data:", bookingData)

    // Validate input
    if (!orderId || !bookingData) {
      console.error("Missing required fields")
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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

    // Check if booking already exists
    const { data: existingBooking } = await supabaseAdmin
      .from("consultation_bookings")
      .select("id")
      .eq("cashfree_order_id", orderId)
      .single()

    if (existingBooking) {
      console.log("Booking already exists, skipping duplicate")
      return NextResponse.json({
        success: true,
        message: "Booking already exists",
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

    // Prepare booking data
    const bookingRecord = {
      full_name: bookingData.fullName,
      email: bookingData.email,
      mobile_number: bookingData.mobileNumber,
      business_idea: bookingData.businessIdea,
      short_description: bookingData.shortDescription,
      payment_amount: parseInt(bookingData.amount),
      payment_status: "paid",
      payment_gateway: "cashfree",
      cashfree_order_id: orderId,
      cashfree_payment_id: payment.cf_payment_id || null,
      payment_method: payment.payment_group || "unknown",
      payment_date: new Date().toISOString(),
    }

    console.log("Attempting to save booking to database:", bookingRecord)

    // Use admin client for insert to bypass RLS
    const { data, error } = await supabaseAdmin
      .from("consultation_bookings")
      .insert([bookingRecord])
      .select()

    if (error) {
      console.error("Supabase insert error:", error)
      console.error("Error code:", error.code)
      console.error("Error message:", error.message)
      console.error("Error details:", error.details)
      throw error
    }

    console.log("Booking saved successfully:", data)
    console.log("=== PAYMENT VERIFICATION COMPLETED ===")

    return NextResponse.json({
      success: true,
      message: "Payment verified and booking saved",
      booking: data[0],
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
