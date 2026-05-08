"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function PaymentCallback() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("processing")
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (!orderId) {
      setStatus("error")
      return
    }

    // Get booking data from sessionStorage
    const bookingDataStr = sessionStorage.getItem("pendingBooking")
    if (!bookingDataStr) {
      setStatus("error")
      return
    }

    const bookingData = JSON.parse(bookingDataStr)

    // Verify payment
    fetch("/api/cashfree/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        bookingData,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Store details for success page
          sessionStorage.setItem("bookingDetails", JSON.stringify({
            fullName: bookingData.fullName,
            email: bookingData.email,
            mobileNumber: bookingData.mobileNumber,
          }))
          sessionStorage.removeItem("pendingBooking")
          
          // Redirect to success page
          window.location.href = `/success?order_id=${orderId}`
        } else {
          setStatus("error")
        }
      })
      .catch(() => {
        setStatus("error")
      })
  }, [orderId])

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">Something went wrong with your payment.</p>
          <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Try Again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment...</h1>
        <p className="text-gray-600">Please wait while we verify your payment.</p>
      </div>
    </div>
  )
}
