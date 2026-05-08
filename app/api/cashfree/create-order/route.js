import { NextResponse } from "next/server"
const { Cashfree } = require("cashfree-pg")

export async function POST(request) {
  try {
    const body = await request.json()
    const { amount, customerName, customerEmail, customerPhone } = body

    // Validate input
    if (!amount || !customerName || !customerEmail || !customerPhone) {
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

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Create order request using REST API
    const orderData = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `customer_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?order_id=${orderId}`,
      },
    }

    const apiUrl = process.env.CASHFREE_ENV === "production"
      ? "https://api.cashfree.com/pg/orders"
      : "https://sandbox.cashfree.com/pg/orders"

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderData),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Cashfree API Error:", {
        status: response.status,
        data: data,
        env: process.env.CASHFREE_ENV,
        appId: process.env.CASHFREE_APP_ID?.substring(0, 10) + "...",
      })
      return NextResponse.json(
        { success: false, error: data.message || "Failed to create order" },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      order: {
        orderId: data.order_id || data.cf_order_id,
        paymentSessionId: data.payment_session_id,
        orderToken: data.order_token,
      },
    })
  } catch (error) {
    console.error("Cashfree order creation error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Cashfree order" },
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
