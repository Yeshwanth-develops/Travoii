import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    console.log(`Searching locations for query: "${query}"`);

    // Fetch from OpenStreetMap Nominatim API
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Travoii-Travel-Planner-App",
        },
      }
    );

    if (!response.ok) {
      console.error(`OSM Nominatim API returned status: ${response.status}`);
      return NextResponse.json([]);
    }

    const data = await response.json();

    // Map OpenStreetMap results to LocationSuggestion structure
    const suggestions = data.map((item: any) => {
      // Get the main name of the location
      const name = item.name || item.display_name.split(",")[0];
      return {
        name: name,
        full_name: item.display_name,
      };
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Location search API error:", error);
    return NextResponse.json([]);
  }
}
