import { NextResponse } from "next/server"
import crypto from "crypto"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = body

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      )
    }

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
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
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
