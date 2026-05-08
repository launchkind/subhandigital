import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const body = await request.json()
    const { orderId, bookingData } = body

    // Fetch order details from Cashfree
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

    if (!response.ok) {
      throw new Error(orderData.message || "Failed to fetch order")
    }

    // Check if payment is successful
    if (orderData.order_status !== "PAID") {
      return NextResponse.json(
        { error: `Payment ${orderData.order_status.toLowerCase()}` },
        { status: 400 }
      )
    }

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

    // Payment verified! Save to database
    const { data, error } = await supabase
      .from("consultation_bookings")
      .insert([
        {
          full_name: bookingData.fullName,
          email: bookingData.email,
          mobile_number: bookingData.mobileNumber,
          business_idea: bookingData.businessIdea,
          short_description: bookingData.shortDescription,
          payment_amount: bookingData.amount,
          payment_status: "paid",
          payment_gateway: "cashfree",
          cashfree_order_id: orderId,
          cashfree_payment_id: payment.cf_payment_id || null,
          payment_method: payment.payment_group || "unknown",
          payment_date: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and booking saved",
      booking: data[0],
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to verify payment" },
      { status: 500 }
    )
  }
}
