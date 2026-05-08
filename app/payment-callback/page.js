"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("processing")
  const [errorMessage, setErrorMessage] = useState("")
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    console.log("=== PAYMENT CALLBACK STARTED ===")
    console.log("Order ID:", orderId)
    
    if (!orderId) {
      console.error("No order ID found")
      setErrorMessage("No order ID found in URL")
      setStatus("error")
      return
    }

    // Verify payment directly from Cashfree (no need for sessionStorage)
    console.log("Calling verify-payment API...")
    fetch("/api/cashfree/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        // No booking data needed - we'll update the existing pending booking
      }),
    })
      .then((res) => {
        console.log("Verify response status:", res.status)
        return res.json()
      })
      .then((data) => {
        console.log("Verify response data:", data)
        
        if (data.success) {
          console.log("Payment verified successfully!")
          // Redirect to success page
          console.log("Redirecting to success page...")
          window.location.href = `/success?order_id=${orderId}`
        } else {
          console.error("Verification failed:", data.error)
          setErrorMessage(data.error || "Payment verification failed")
          setStatus("error")
        }
      })
      .catch((error) => {
        console.error("Verification error:", error)
        setErrorMessage("Network error: " + error.message)
        setStatus("error")
      })
  }, [orderId])

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Issue</h1>
          <p className="text-gray-600 mb-4">{errorMessage || "Something went wrong with your payment verification."}</p>
          {orderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Order ID:</span> {orderId}
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Save this Order ID and contact support if needed.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <a 
              href="/" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
            >
              Back to Home
            </a>
            <a 
              href="mailto:support@subhandigital.com" 
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 inline-block"
            >
              Contact Support
            </a>
          </div>
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

export default function PaymentCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <PaymentCallbackContent />
    </Suspense>
  )
}
