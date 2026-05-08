"use client";

import { useState, useEffect } from "react";

const trustAvatars = [
  { initials: "SA", tint: "bg-slate-950 text-white" },
  { initials: "AR", tint: "bg-emerald-500 text-white" },
  { initials: "MK", tint: "bg-slate-200 text-slate-700" },
  { initials: "VP", tint: "bg-white text-slate-700 border border-slate-200" },
];

const testimonials = [
  {
    name: "Aman K.",
    role: "SaaS founder",
    result: "Left with a clear pricing plan and a stronger landing page message.",
  },
  {
    name: "Riya S.",
    role: "D2C founder",
    result: "Got a faster path to launch and a cleaner offer structure in one call.",
  },
  {
    name: "Nikhil P.",
    role: "Agency owner",
    result: "Turned confusion into a simple growth roadmap and booked next steps.",
  },
];

const whoItsFor = [
  "Founders who need pricing clarity fast",
  "Anyone validating an app, website, or startup idea",
  "Builders who want direct founder feedback, not theory",
];

const whatYouGet = [
  "A clear next-step plan for your business or idea",
  "Practical feedback on offer, pricing, and positioning",
  "Founder-led guidance with no fluff or upsell",
];

function IconShell({ children }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-slate-500 shadow-sm">
      {children}
    </span>
  );
}

function WhatsAppIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.5 12a8.5 8.5 0 0 1-12.9 7.3L4 20l.8-3.4A8.5 8.5 0 1 1 20.5 12z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.5 9.5c.2-.5.4-.7.9-.7h.8c.3 0 .6.2.7.5l.7 1.8c.1.3 0 .6-.2.8l-.7.7c1 1.8 2.4 3.2 4.2 4.2l.7-.7c.2-.2.5-.3.8-.2l1.8.7c.3.1.5.4.5.7v.8c0 .5-.2.7-.7.9-.8.3-1.6.4-2.4.1-2.7-.9-5.6-3.8-6.5-6.5-.3-.8-.2-1.6.1-2.4z"
      />
    </svg>
  );
}

function SparkIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4 10-10" />
    </svg>
  );
}

function StarIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.5l2.9 5.9 6.6 1-4.8 4.7 1.1 6.6L12 17.7 6.2 20.7l1.1-6.6-4.8-4.7 6.6-1L12 2.5z" />
    </svg>
  );
}

function UserIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="8" r="4" />
    </svg>
  );
}

function PhoneIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 4.5h3l1.5 4-2 1.5c.9 1.8 2.2 3.1 4 4l1.5-2 4 1.5v3c0 .8-.7 1.5-1.5 1.5C10 18 6 14 6 6c0-.8.7-1.5 1.5-1.5z"
      />
    </svg>
  );
}

function IdeaIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 22h4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2a7 7 0 0 0-4 12c.9.7 1.5 1.7 1.8 2.9h4.4c.3-1.2.9-2.2 1.8-2.9A7 7 0 0 0 12 2z"
      />
    </svg>
  );
}

function MessageIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5.5h16v11H8l-4 3v-3.2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9h8M8 12h5" />
    </svg>
  );
}

function FloatingField({ label, icon, as = "input", className = "", ...props }) {
  const Component = as;

  return (
    <div className="group relative">
      <div className="absolute left-4 top-4 z-10 text-slate-400 transition-colors group-focus-within:text-emerald-600">
        {icon}
      </div>
      <Component
        placeholder=" "
        className={`peer w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition
          placeholder-transparent focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100
          ${as === "textarea" ? "min-h-[132px] py-6 pl-12 pr-4" : "h-14 pl-12 pr-4 pt-6 pb-2"}
          ${className}`}
        {...props}
      />
      <label
        className="pointer-events-none absolute left-12 top-4 origin-left text-sm text-slate-500 transition-all duration-200
          peer-focus:top-2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-emerald-700
          peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-medium
          peer-[:not(:placeholder-shown)]:text-emerald-700"
      >
        {label}
      </label>
    </div>
  );
}

export default function HomePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    businessIdea: "",
    shortDescription: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingPrice, setBookingPrice] = useState(999);

  // Fetch booking price on component mount
  useEffect(() => {
    console.log("Fetching booking price...");
    fetch("/api/settings/booking-price")
      .then((res) => res.json())
      .then((data) => {
        console.log("Booking price response:", data);
        if (data.success) {
          setBookingPrice(data.bookingPrice);
          console.log("Booking price set to:", data.bookingPrice);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch booking price:", error);
      });
  }, []);

  const isMobileValid = /^\d{10}$/.test(formData.mobileNumber);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isMobileValid) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    
    if (!isEmailValid) {
      alert("Please enter a valid email address");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create Cashfree order
      const orderResponse = await fetch("/api/cashfree/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: bookingPrice,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.mobileNumber,
        }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error("Order API error:", errorText);
        throw new Error(`Failed to create order: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Store booking data in database as pending
      const pendingBookingResponse = await fetch("/api/create-pending-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderData.order.orderId,
          bookingData: {
            fullName: formData.fullName,
            email: formData.email,
            mobileNumber: formData.mobileNumber,
            businessIdea: formData.businessIdea,
            shortDescription: formData.shortDescription,
            amount: bookingPrice,
          }
        })
      });

      if (!pendingBookingResponse.ok) {
        console.warn("Failed to create pending booking, continuing anyway");
      }

      // Step 2: Initialize Cashfree SDK
      if (!window.Cashfree) {
        throw new Error("Cashfree SDK not loaded. Please refresh the page.");
      }

      const cashfree = await window.Cashfree({
        mode: "production", // Always use production mode
      });

      // Step 3: Open Cashfree checkout
      const checkoutOptions = {
        paymentSessionId: orderData.order.paymentSessionId,
        returnUrl: `${window.location.origin}/payment-callback?order_id=${orderData.order.orderId}`,
      };

      cashfree.checkout(checkoutOptions).then(async (result) => {
        if (result.error) {
          console.error("Payment error:", result.error);
          alert(result.error.message || "Payment failed. Please try again.");
          setIsProcessing(false);
          return;
        }

        if (result.redirect) {
          // Payment is being processed, will redirect
          console.log("Payment redirect:", result.redirect);
        }

        if (result.paymentDetails) {
          // Payment completed, verify and save
          try {
            const verifyResponse = await fetch("/api/cashfree/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.order.orderId,
                bookingData: {
                  fullName: formData.fullName,
                  email: formData.email,
                  mobileNumber: formData.mobileNumber,
                  businessIdea: formData.businessIdea,
                  shortDescription: formData.shortDescription,
                  amount: bookingPrice,
                },
              }),
            });

            if (!verifyResponse.ok) {
              const errorText = await verifyResponse.text();
              console.error("Verify API error:", errorText);
              throw new Error(`Failed to verify payment: ${verifyResponse.status}`);
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Store booking details for success page
              sessionStorage.setItem("bookingDetails", JSON.stringify({
                fullName: formData.fullName,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
              }));
              
              // Redirect to success page
              window.location.href = `/success?order_id=${orderData.order.orderId}`;
            } else {
              throw new Error(verifyData.error || "Payment verification failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment successful but booking failed. Please contact support with your order ID: " + orderData.order.orderId);
          } finally {
            setIsProcessing(false);
          }
        }
      }).catch((error) => {
        console.error("Cashfree checkout error:", error);
        alert("Failed to open payment page. Please try again.");
        setIsProcessing(false);
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(148,163,184,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ef_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-slate-500">
                Built and scaled Sabjihub
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl lg:text-6xl">
                Consult Directly with Subhan Ali
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                Book a focused consultation for pricing clarity, offer strategy, and your next growth move.
                Designed to build trust instantly and help serious founders move fast.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="flex -space-x-2">
                {trustAvatars.map((avatar) => (
                  <span
                    key={avatar.initials}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-white text-[11px] font-semibold shadow-sm ${avatar.tint}`}
                  >
                    {avatar.initials}
                  </span>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Trusted by 100+ founders</p>
                <p className="text-xs text-slate-500">Founders, operators, and solo builders</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} className="h-4 w-4" />
                    ))}
                  </div>
                  <p className="text-sm leading-7 text-slate-600">"{testimonial.result}"</p>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{testimonial.role}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Offer</p>
                <p className="mt-2 text-sm font-medium text-emerald-950">Limited time founder offer</p>
                <p className="mt-2 text-xs leading-5 text-emerald-800">
                  Offer expires soon, so this pricing is reserved for a short window.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Reassurance</p>
                <p className="mt-2 text-sm font-medium text-slate-900">No spam, no upsell</p>
                <p className="mt-2 text-xs leading-5 text-slate-500">Just a focused call and a clear next step.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Support</p>
                <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                  <WhatsAppIcon className="h-4 w-4 text-emerald-600" />
                  WhatsApp support available
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">If you need help, just reach out before booking.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
                  What you will get
                </p>
                <div className="mt-4 space-y-3">
                  {whatYouGet.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <IconShell>
                        <CheckIcon className="h-4 w-4 text-emerald-600" />
                      </IconShell>
                      <p className="pt-2 text-sm leading-7 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
                  Who is this for?
                </p>
                <div className="mt-4 space-y-3">
                  {whoItsFor.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <IconShell>
                        <SparkIcon className="h-4 w-4 text-emerald-600" />
                      </IconShell>
                      <p className="pt-2 text-sm leading-7 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.1)] ring-1 ring-white/60 sm:p-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Booking form</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  Reserve your slot for ₹{bookingPrice}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Instant confirmation after payment and a quick follow-up from our team.
                </p>
              </div>

              <form id="booking-form" onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                  <FloatingField
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    label="Full name"
                    icon={<UserIcon className="h-4 w-4" />}
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, fullName: event.target.value }))
                    }
                  />

                  <FloatingField
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    label="Email address"
                    icon={
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.9 5.3c.7.4 1.5.4 2.2 0L21 8M5 19h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2z" />
                      </svg>
                    }
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                  {formData.email.length > 0 && !isEmailValid ? (
                    <p className="text-xs text-rose-500">Enter a valid email address.</p>
                  ) : null}

                  <FloatingField
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    autoComplete="tel"
                    required
                    label="Mobile number"
                    icon={<PhoneIcon className="h-4 w-4" />}
                    value={formData.mobileNumber}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        mobileNumber: event.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
                  />
                  {formData.mobileNumber.length > 0 && !isMobileValid ? (
                    <p className="text-xs text-rose-500">Enter a valid 10-digit mobile number.</p>
                  ) : null}

                  <FloatingField
                    id="businessIdea"
                    name="businessIdea"
                    type="text"
                    autoComplete="organization"
                    required
                    label="Business idea"
                    icon={<IdeaIcon className="h-4 w-4" />}
                    value={formData.businessIdea}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, businessIdea: event.target.value }))
                    }
                  />

                  <FloatingField
                    as="textarea"
                    id="shortDescription"
                    name="shortDescription"
                    rows="5"
                    required
                    label="Short description"
                    icon={<MessageIcon className="h-4 w-4" />}
                    value={formData.shortDescription}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, shortDescription: event.target.value }))
                    }
                    className="resize-none"
                  />
                </div>

                <div className="relative isolate pt-1">
                  <div className="absolute inset-x-6 -bottom-2 -z-10 h-12 rounded-full bg-emerald-500/35 blur-2xl opacity-70" />
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 px-5 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(22,163,74,0.34)] transition duration-300 hover:scale-[1.01] hover:shadow-[0_24px_60px_rgba(22,163,74,0.42)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? "Processing..." : `Book Consultation for ₹${bookingPrice}`}
                  </button>
                </div>

                <div className="space-y-1.5 text-center">
                  <p className="text-sm text-slate-500">Instant confirmation after payment</p>
                  <p className="text-xs text-slate-500">Secure payment via Cashfree</p>
                  <p className="text-xs text-slate-500">We will contact you within 24 hours</p>
                </div>
              </form>
            </div>
          </aside>
        </section>

      </div>

    </main>
  );
}
