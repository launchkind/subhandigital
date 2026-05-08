import "./globals.css";

export const metadata = {
  title: "Subhan Digital",
  description: "A simple one-page consultation site with a Razorpay payment button.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
