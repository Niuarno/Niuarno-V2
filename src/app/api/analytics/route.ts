import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, userAgent, country, deviceType } = body;

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Try to update existing record for today
    const { data: existing, error: fetchError } = await supabase
      .from("analytics")
      .select("*")
      .eq("date", today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from("analytics")
        .update({
          visitors: existing.visitors + 1,
          page_views: existing.page_views + 1,
          country: country || existing.country,
          device_type: deviceType || existing.device_type,
          browser: userAgent || existing.browser,
          referrer: referrer || existing.referrer,
        })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      // Create new record
      const { error } = await supabase
        .from("analytics")
        .insert({
          date: today,
          visitors: 1,
          page_views: 1,
          country,
          device_type: deviceType,
          browser: userAgent,
          referrer,
        });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track analytics" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get analytics data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from("analytics")
      .select("*")
      .gte("date", thirtyDaysAgo.toISOString().split('T')[0])
      .order("date", { ascending: false });

    if (error) throw error;

    // Aggregate data
    const aggregated = {
      totalVisitors: data.reduce((sum, day) => sum + day.visitors, 0),
      totalPageViews: data.reduce((sum, day) => sum + day.page_views, 0),
      dailyData: data,
      deviceStats: data.reduce((acc, day) => {
        const device = day.device_type || 'unknown';
        acc[device] = (acc[device] || 0) + day.visitors;
        return acc;
      }, {} as Record<string, number>),
      countryStats: data.reduce((acc, day) => {
        if (day.country) {
          acc[day.country] = (acc[day.country] || 0) + day.visitors;
        }
        return acc;
      }, {} as Record<string, number>),
    };

    return NextResponse.json(aggregated);
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}