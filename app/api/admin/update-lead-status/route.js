import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { access_token, leadId, callStatus, callDetails, callDate, nextFollowUp } = await request.json()

    if (!access_token || !leadId || !callStatus) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate call_status
    const validStatuses = ['pending', 'called', 'not_interested', 'follow_up', 'converted']
    if (!validStatuses.includes(callStatus)) {
      return Response.json(
        { success: false, error: "Invalid call status" },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData = {
      call_status: callStatus,
      call_details: callDetails || null,
      call_date: callDate ? new Date(callDate).toISOString() : new Date().toISOString(),
      next_follow_up: nextFollowUp ? new Date(nextFollowUp).toISOString() : null,
      updated_at: new Date().toISOString()
    }

    // Create auth-only client with access token to verify admin user
    const { data: user, error: userError } = await supabaseAdmin.auth.getUser(access_token)

    if (userError || !user) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Update the lead
    const { data, error } = await supabaseAdmin
      .from('consultation_bookings')
      .update(updateData)
      .eq('id', leadId)
      .select()

    if (error) {
      console.error("Database error:", error)
      return Response.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return Response.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      message: "Lead updated successfully",
      data: data[0]
    })
  } catch (error) {
    console.error("Update lead error:", error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
