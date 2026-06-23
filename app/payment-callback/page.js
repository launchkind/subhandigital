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

    const verifyPayment = async () => {
      console.log("Calling verify-payment API...")
      const res = await fetch("/api/cashfree/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })
      console.log("Verify response status:", res.status)
      return res.json()
    }

    const recoverAndVerify = async () => {
      // Booking was not found — try to recreate it from sessionStorage backup
      const saved = sessionStorage.getItem(`booking_${orderId}`)
      if (!saved) return false

      console.log("Attempting recovery from sessionStorage backup...")
      const bookingPayload = JSON.parse(saved)
      const createRes = await fetch("/api/create-pending-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, bookingData: bookingPayload }),
      })
      if (!createRes.ok) return false

      const createData = await createRes.json()
      if (!createData.success) return false

      console.log("Booking recreated from backup, retrying verification...")
      const retryData = await verifyPayment()
      if (retryData.success) {
        sessionStorage.removeItem(`booking_${orderId}`)
        return true
      }
      return false
    }

    const run = async () => {
      try {
        const data = await verifyPayment()
        console.log("Verify response data:", data)

        if (data.success) {
          console.log("Payment verified successfully!")
          sessionStorage.removeItem(`booking_${orderId}`)
          window.location.href = `/success?order_id=${orderId}`
          return
        }

        // Booking missing — attempt automatic recovery
        if (data.error && data.error.includes("Booking not found")) {
          console.log("Booking not found, attempting recovery...")
          const recovered = await recoverAndVerify()
          if (recovered) {
            window.location.href = `/success?order_id=${orderId}`
            return
          }
        }

        console.error("Verification failed:", data.error)
        setErrorMessage(data.error || "Payment verification failed")
        setStatus("error")
      } catch (error) {
        console.error("Verification error:", error)
        setErrorMessage("Network error: " + error.message)
        setStatus("error")
      }
    }

    run()
  }, [orderId])

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Issue</h1>
          <p className="text-gray-600 mb-4">
            Your payment may have gone through but we couldn't confirm it automatically.
            Click <strong>Retry</strong> — it usually resolves in one click.
          </p>
          {orderId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Order ID:</span> {orderId}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Save this — share it with support if retry doesn't work.
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setStatus("processing")
                setErrorMessage("")
                window.location.reload()
              }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
            >
              Retry Verification
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
            >
              Back to Home
            </a>
            <a
              href={`https://wa.me/917897XXXXXX?text=Payment%20done%20but%20not%20verified.%20Order%20ID:%20${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 inline-block"
            >
              Contact on WhatsApp
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
