"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase"

export default function AdminDashboard() {
  const [supabase] = useState(() => createBrowserClient())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [session, setSession] = useState(null)
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalAmount: 0,
    recentBookings: []
  })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedLead, setSelectedLead] = useState(null)
  const [bookingPrice, setBookingPrice] = useState(999)
  const [newPrice, setNewPrice] = useState(999)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  
  // Lead status update states
  const [callStatus, setCallStatus] = useState("")
  const [callDetails, setCallDetails] = useState("")
  const [callDate, setCallDate] = useState("")
  const [nextFollowUp, setNextFollowUp] = useState("")
  const [isUpdatingLead, setIsUpdatingLead] = useState(false)
  const [leadUpdateMessage, setLeadUpdateMessage] = useState("")
  
  // Search and filter states
  const [searchName, setSearchName] = useState("")
  const [searchPhone, setSearchPhone] = useState("")
  const [filterCallDateFrom, setFilterCallDateFrom] = useState("")
  const [filterCallDateTo, setFilterCallDateTo] = useState("")
  const [filterFollowUpDateFrom, setFilterFollowUpDateFrom] = useState("")
  const [filterFollowUpDateTo, setFilterFollowUpDateTo] = useState("")
  const [filterCallStatus, setFilterCallStatus] = useState("")
  
  // Mobile menu state
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Filter modal state
  const [filterModalOpen, setFilterModalOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (selectedLead) {
      setCallStatus(selectedLead.call_status || "pending")
      setCallDetails(selectedLead.call_details || "")
      setCallDate(selectedLead.call_date ? selectedLead.call_date.split('T')[0] : "")
      setNextFollowUp(selectedLead.next_follow_up ? selectedLead.next_follow_up.split('T')[0] : "")
      setLeadUpdateMessage("")
    }
  }, [selectedLead])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setSession(session)
        setIsAuthenticated(true)
        fetchStats(session.access_token)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (data.success) {
        // Set the session in Supabase client
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })
        
        setSession(data.session)
        setIsAuthenticated(true)
        fetchStats(data.session.access_token)
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: session?.access_token })
      })
      
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setSession(null)
      setEmail("")
      setPassword("")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const fetchStats = async (accessToken) => {
    try {
      const response = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken })
      })
      
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }

      // Fetch settings
      const settingsResponse = await fetch("/api/admin/settings")
      const settingsData = await settingsResponse.json()
      console.log("Admin settings response:", settingsData)
      if (settingsData.success) {
        setBookingPrice(settingsData.settings.bookingPrice)
        setNewPrice(settingsData.settings.bookingPrice)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleSavePrice = async () => {
    setIsSaving(true)
    setSaveMessage("")

    try {
      console.log("Saving new price:", newPrice)
      
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: session?.access_token,
          bookingPrice: parseInt(newPrice)
        })
      })

      const data = await response.json()
      console.log("Save response:", data)

      if (data.success) {
        setBookingPrice(parseInt(newPrice))
        setSaveMessage("✅ Price updated successfully! The new price will appear on the booking form.")
        setTimeout(() => setSaveMessage(""), 5000)
      } else {
        setSaveMessage("❌ Failed to update price: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Save error:", error)
      setSaveMessage("❌ Error updating price: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateLeadStatus = async () => {
    if (!selectedLead) return
    
    setIsUpdatingLead(true)
    setLeadUpdateMessage("")

    try {
      const response = await fetch("/api/admin/update-lead-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: session?.access_token,
          leadId: selectedLead.id,
          callStatus: callStatus,
          callDetails: callDetails,
          callDate: callDate,
          nextFollowUp: nextFollowUp
        })
      })

      const data = await response.json()

      if (data.success) {
        setLeadUpdateMessage("✅ Lead status updated successfully!")
        // Update the selected lead with new data
        setSelectedLead(data.data)
        // Update the stats with new lead info
        const updatedBookings = stats.recentBookings.map(b => 
          b.id === data.data.id ? data.data : b
        )
        setStats({ ...stats, recentBookings: updatedBookings })
        setTimeout(() => setLeadUpdateMessage(""), 5000)
      } else {
        setLeadUpdateMessage("❌ Failed to update: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Update error:", error)
      setLeadUpdateMessage("❌ Error: " + error.message)
    } finally {
      setIsUpdatingLead(false)
    }
  }

  const getFilteredLeads = () => {
    return stats.recentBookings.filter(lead => {
      // Search by name
      if (searchName && !lead.full_name.toLowerCase().includes(searchName.toLowerCase())) {
        return false
      }

      // Search by phone
      if (searchPhone && !lead.mobile_number.includes(searchPhone)) {
        return false
      }

      // Filter by call status
      if (filterCallStatus && lead.call_status !== filterCallStatus) {
        return false
      }

      // Filter by call date range
      if (filterCallDateFrom) {
        const callDateObj = lead.call_date ? new Date(lead.call_date) : null
        const filterDateFrom = new Date(filterCallDateFrom)
        if (!callDateObj || callDateObj < filterDateFrom) {
          return false
        }
      }

      if (filterCallDateTo) {
        const callDateObj = lead.call_date ? new Date(lead.call_date) : null
        const filterDateTo = new Date(filterCallDateTo)
        filterDateTo.setHours(23, 59, 59, 999)
        if (!callDateObj || callDateObj > filterDateTo) {
          return false
        }
      }

      // Filter by follow-up date range
      if (filterFollowUpDateFrom) {
        const followUpDateObj = lead.next_follow_up ? new Date(lead.next_follow_up) : null
        const filterDateFrom = new Date(filterFollowUpDateFrom)
        if (!followUpDateObj || followUpDateObj < filterDateFrom) {
          return false
        }
      }

      if (filterFollowUpDateTo) {
        const followUpDateObj = lead.next_follow_up ? new Date(lead.next_follow_up) : null
        const filterDateTo = new Date(filterFollowUpDateTo)
        filterDateTo.setHours(23, 59, 59, 999)
        if (!followUpDateObj || followUpDateObj > filterDateTo) {
          return false
        }
      }

      return true
    })
  }

  const filteredLeads = getFilteredLeads()

  const clearFilters = () => {
    setSearchName("")
    setSearchPhone("")
    setFilterCallDateFrom("")
    setFilterCallDateTo("")
    setFilterFollowUpDateFrom("")
    setFilterFollowUpDateTo("")
    setFilterCallStatus("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <div className="md:hidden bg-white shadow-md border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white shadow-lg md:fixed md:h-full md:top-0 md:left-0 z-40 transition-all duration-300`}>
        <div className="p-6 border-b border-gray-200 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        
        <nav className="p-4">
          <button
            onClick={() => {
              setActiveTab("dashboard")
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
          
          <button
            onClick={() => {
              setActiveTab("leads")
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "leads"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            All Leads
            <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {stats.totalLeads}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("settings")
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === "settings"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </nav>

        <div className="md:absolute md:bottom-0 md:w-64 p-4 md:border-t border-gray-200 md:bg-white">
          <button
            onClick={() => {
              handleLogout()
              setSidebarOpen(false)
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="w-full md:ml-64 flex-1 p-0 md:p-0">
        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <>
            <div className="p-4 md:p-8 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Welcome back! Here's your business summary.</p>
            </div>

            <div className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl md:text-4xl font-bold text-blue-600 mt-2">
                  {stats.totalLeads}
                </p>
              </div>
              <div className="bg-blue-100 p-3 md:p-4 rounded-full">
                <svg className="w-6 md:w-8 h-6 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl md:text-4xl font-bold text-green-600 mt-2">
                  ₹{stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 md:p-4 rounded-full">
                <svg className="w-6 md:w-8 h-6 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
            </div>

            <div className="px-4 md:px-8 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-3 md:px-6 py-8 text-center text-gray-500 text-sm">
                      No bookings yet
                    </td>
                  </tr>
                ) : (
                  stats.recentBookings.map((booking, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                        {booking.full_name}
                      </td>
                      <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {booking.email}
                      </td>
                      <td className="hidden md:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {booking.mobile_number}
                      </td>
                      <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm font-semibold text-green-600">
                        ₹{booking.payment_amount}
                      </td>
                      <td className="hidden sm:table-cell px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {new Date(booking.payment_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
            </div>
          </>
        )}

        {/* Leads View */}
        {activeTab === "leads" && (
          <>
            <div className="p-4 md:p-8 pb-0 mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">All Leads</h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Manage and view all consultation bookings.</p>
            </div>

            <div className="h-[calc(100vh-80px)] p-4 md:p-8 pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full">
              {/* Leads List */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-900">
                      Leads: {filteredLeads.length} / {stats.recentBookings.length}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setFilterModalOpen(true)}
                        className="text-xs bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Filters
                      </button>
                      {(searchName || searchPhone || filterCallDateFrom || filterCallDateTo || filterFollowUpDateFrom || filterFollowUpDateTo || filterCallStatus) && (
                        <button
                          onClick={clearFilters}
                          className="text-xs bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Search by phone..."
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 overflow-y-auto flex-1">
                  {filteredLeads.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No leads match your filters
                    </div>
                  ) : (
                    filteredLeads.map((lead, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedLead?.cashfree_order_id === lead.cashfree_order_id
                            ? "bg-blue-50 border-l-4 border-blue-600"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{lead.full_name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{lead.email}</p>
                            <p className="text-sm text-gray-600">{lead.mobile_number}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">₹{lead.payment_amount}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(lead.payment_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Paid
                          </span>
                          {lead.call_status && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              lead.call_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              lead.call_status === 'called' ? 'bg-blue-100 text-blue-800' :
                              lead.call_status === 'not_interested' ? 'bg-red-100 text-red-800' :
                              lead.call_status === 'follow_up' ? 'bg-orange-100 text-orange-800' :
                              lead.call_status === 'converted' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {lead.call_status === 'pending' ? '⏳ ' :
                               lead.call_status === 'called' ? '✓ ' :
                               lead.call_status === 'not_interested' ? '✗ ' :
                               lead.call_status === 'follow_up' ? '⚠ ' :
                               lead.call_status === 'converted' ? '✓✓ ' : ''}
                              {lead.call_status.replace(/_/g, ' ').toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Lead Details Panel */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                <div className="px-4 md:px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Lead Details</h3>
                </div>
                
                {selectedLead ? (
                  <div className="p-4 md:p-6 space-y-4 max-h-[calc(100vh-400px)] md:max-h-[calc(100vh-250px)] overflow-y-auto">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Full Name</label>
                      <p className="text-gray-900 font-medium mt-1 break-words">{selectedLead.full_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Email</label>
                      <p className="text-gray-900 mt-1 break-words">{selectedLead.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Mobile Number</label>
                      <p className="text-gray-900 mt-1">{selectedLead.mobile_number}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Business Idea</label>
                      <p className="text-gray-900 mt-1 break-words">{selectedLead.business_idea}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                      <p className="text-gray-900 mt-1 break-words">{selectedLead.short_description}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <label className="text-xs font-medium text-gray-500 uppercase">Payment Amount</label>
                      <p className="text-2xl font-bold text-green-600 mt-1">₹{selectedLead.payment_amount}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Payment Method</label>
                      <p className="text-gray-900 mt-1 capitalize">{selectedLead.payment_method}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Payment Date</label>
                      <p className="text-gray-900 mt-1">
                        {new Date(selectedLead.payment_date).toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase">Order ID</label>
                      <p className="text-xs text-gray-600 mt-1 break-all">{selectedLead.cashfree_order_id}</p>
                    </div>
                    
                    {selectedLead.cashfree_payment_id && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase">Payment ID</label>
                        <p className="text-xs text-gray-600 mt-1 break-all">{selectedLead.cashfree_payment_id}</p>
                      </div>
                    )}

                    {/* Lead Status Update Section */}
                    <div className="pt-6 border-t border-gray-200 space-y-4">
                      <h4 className="font-bold text-gray-900 text-sm">Update Call Status</h4>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Call Status</label>
                        <select
                          value={callStatus}
                          onChange={(e) => setCallStatus(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="called">✓ Called</option>
                          <option value="not_interested">✗ Not Interested</option>
                          <option value="follow_up">⚠ Follow Up</option>
                          <option value="converted">✓✓ Converted</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Call Details</label>
                        <textarea
                          value={callDetails}
                          onChange={(e) => setCallDetails(e.target.value)}
                          placeholder="Add notes from the call..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          rows="3"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Call Date</label>
                        <input
                          type="date"
                          value={callDate}
                          onChange={(e) => setCallDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2 uppercase">Next Follow Up</label>
                        <input
                          type="date"
                          value={nextFollowUp}
                          onChange={(e) => setNextFollowUp(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <button
                        onClick={handleUpdateLeadStatus}
                        disabled={isUpdatingLead}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-sm"
                      >
                        {isUpdatingLead ? "Updating..." : "Update Lead Status"}
                      </button>

                      {leadUpdateMessage && (
                        <div className={`p-3 rounded-lg text-sm ${
                          leadUpdateMessage.includes("success")
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {leadUpdateMessage}
                        </div>
                      )}

                      {selectedLead.call_status && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                          <p className="text-gray-700"><span className="font-semibold">Last Status:</span> {selectedLead.call_status}</p>
                          {selectedLead.call_date && <p className="text-gray-700 text-xs mt-1">Updated: {new Date(selectedLead.call_date).toLocaleString()}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p>Select a lead to view details</p>
                  </div>
                )}
              </div>
              </div>
            </div>
          </>
        )}

        {/* Settings View */}
        {activeTab === "settings" && (
          <>
            <div className="p-4 md:p-8 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Manage your application settings.</p>
            </div>

            <div className="max-w-2xl">
              <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Price</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Booking Price
                    </label>
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{bookingPrice}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Booking Price
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                          min="1"
                          step="1"
                        />
                      </div>
                      <button
                        onClick={handleSavePrice}
                        disabled={isSaving || newPrice === bookingPrice}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold w-full sm:w-auto"
                      >
                        {isSaving ? "Saving..." : "Update Price"}
                      </button>
                    </div>
                  </div>

                  {saveMessage && (
                    <div className={`p-4 rounded-lg text-sm ${
                      saveMessage.includes("success")
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {saveMessage}
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <div className="flex gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Note:</p>
                        <p>This price will be applied to all new bookings. Existing bookings will not be affected.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Filter Modal */}
        {filterModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                <button
                  onClick={() => setFilterModalOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Call Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call Status</label>
                  <select
                    value={filterCallStatus}
                    onChange={(e) => setFilterCallStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="called">✓ Called</option>
                    <option value="not_interested">✗ Not Interested</option>
                    <option value="follow_up">⚠ Follow Up</option>
                    <option value="converted">✓✓ Converted</option>
                  </select>
                </div>

                {/* Call Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={filterCallDateFrom}
                      onChange={(e) => setFilterCallDateFrom(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={filterCallDateTo}
                      onChange={(e) => setFilterCallDateTo(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Follow-up Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date Range</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={filterFollowUpDateFrom}
                      onChange={(e) => setFilterFollowUpDateFrom(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      value={filterFollowUpDateTo}
                      onChange={(e) => setFilterFollowUpDateTo(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setFilterModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={() => {
                      clearFilters()
                      setFilterModalOpen(false)
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
