import { connectDB } from "@/lib/db";
import Trip from "@/models/Trip";
import Itinerary from "@/models/Itinerary";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    await connectDB();

    const { tripId, regenerate } = await req.json();
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return new Response("Trip not found", { status: 404 });
    }

    if (!regenerate) {
      const existingItinerary = await Itinerary.findOne({ tripId });
      if (existingItinerary) {
        return new Response(JSON.stringify(existingItinerary), { status: 200 });
      }
    } else {
      // Clear out the old itinerary for this trip before regenerating
      await Itinerary.deleteOne({ tripId });
    }

    const budget = Number(trip.budget) || 1000;
    const start = trip.startLocation || "your location";
    const destination = trip.endLocation || "Destination";
    const stopsStr = trip.stops && trip.stops.length > 0 ? `, passing through ${trip.stops.join(", ")}` : "";

    let daysData;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const isGeminiConfigured = geminiKey && geminiKey !== "your_gemini_key" && geminiKey.trim() !== "";
    const isOpenaiConfigured = openaiKey && openaiKey !== "your_openai_key" && openaiKey.trim() !== "";

    if (isGeminiConfigured) {
      console.log("Generating itinerary using Gemini API...");
      const prompt = `Generate a realistic 3-day travel itinerary for a trip starting from ${start} to ${destination}${stopsStr}. 
The total budget for activities, dining, and local travel is ₹${budget}. 
Return the itinerary in JSON format conforming exactly to this structure:
{
  "days": [
    {
      "day": number,
      "activities": string[],
      "estimatedCost": number
    }
  ]
}
The estimatedCost for all days must sum up to approximately ₹${budget} and cannot exceed it. Make sure the activities are realistic, exciting, and specifically customized for ${destination}.`;

      let responseText = "";
      let errorOccurred = null;

      // Try multiple model variations in case of 503 Service Unavailable / High Demand
      const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting generation with Gemini model ${modelName}...`);
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: "application/json" },
          });

          const result = await model.generateContent(prompt);
          responseText = result.response.text();
          if (responseText) {
            console.log(`Successfully generated itinerary using ${modelName}`);
            errorOccurred = null;
            break;
          }
        } catch (err) {
          console.warn(`Gemini model ${modelName} failed/unavailable:`, err instanceof Error ? err.message : String(err));
          errorOccurred = err;
        }
      }

      if (errorOccurred || !responseText) {
        console.warn("All Gemini models failed or returned empty. Falling back to default structured itinerary.");
        daysData = [
          {
            day: 1,
            activities: [
              `Depart from ${start} and arrive in ${destination}${stopsStr}`,
              `Check-in at accommodation and freshen up`,
              `Take a leisurely walking tour of the local area and try local delicacies for dinner`,
            ],
            estimatedCost: Math.max(100, Math.round(budget * 0.25)),
          },
          {
            day: 2,
            activities: [
              `Visit top attractions and local landmarks in ${destination}`,
              `Enjoy an authentic local lunch at a highly-rated diner`,
              `Attend a cultural event, museum, or join a scenic evening boat ride/activity`,
            ],
            estimatedCost: Math.max(100, Math.round(budget * 0.45)),
          },
          {
            day: 3,
            activities: [
              `Short morning excursion or nature walk around ${destination}`,
              `Shop for souvenirs and local handicrafts`,
              `Pack bags and prepare for departure back to ${start}`,
            ],
            estimatedCost: Math.max(100, Math.round(budget * 0.3)),
          },
        ];
      } else {
        const parsed = JSON.parse(responseText);
        if (!parsed.days || !Array.isArray(parsed.days)) {
          throw new Error("Invalid response format from Gemini: 'days' array is missing");
        }
        daysData = parsed.days;
      }
    } else if (isOpenaiConfigured) {
      console.log("Generating itinerary using OpenAI API...");
      const prompt = `Generate a realistic 3-day travel itinerary for a trip starting from ${start} to ${destination}${stopsStr}. 
The total budget for activities, dining, and local travel is ₹${budget}. 
Return the itinerary in JSON format conforming exactly to this structure:
{
  "days": [
    {
      "day": number,
      "activities": string[],
      "estimatedCost": number
    }
  ]
}
Keep the response strictly as valid JSON, with no other text, markdown blocks, or comments. The estimatedCost for all days must sum up to approximately ₹${budget} and cannot exceed it. Make sure the activities are realistic, exciting, and specifically customized for ${destination}.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert travel planner that generates structured JSON itineraries." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error("No response content from OpenAI");
      }

      const parsed = JSON.parse(responseText);
      if (!parsed.days || !Array.isArray(parsed.days)) {
        throw new Error("Invalid response format: 'days' array is missing");
      }
      daysData = parsed.days;
    } else {
      console.warn("Using placeholder itinerary because no valid API keys are configured.");
      daysData = [
        {
          day: 1,
          activities: [
            `Depart from ${start} and arrive in ${destination}${stopsStr}`,
            `Check-in at accommodation and freshen up`,
            `Take a leisurely walking tour of the local area and try local delicacies for dinner`,
          ],
          estimatedCost: Math.max(100, Math.round(budget * 0.25)),
        },
        {
          day: 2,
          activities: [
            `Visit top attractions and local landmarks in ${destination}`,
            `Enjoy an authentic local lunch at a highly-rated diner`,
            `Attend a cultural event, museum, or join a scenic evening boat ride/activity`,
          ],
          estimatedCost: Math.max(100, Math.round(budget * 0.45)),
        },
        {
          day: 3,
          activities: [
            `Short morning excursion or nature walk around ${destination}`,
            `Shop for souvenirs and local handicrafts`,
            `Pack bags and prepare for departure back to ${start}`,
          ],
          estimatedCost: Math.max(100, Math.round(budget * 0.3)),
        },
      ];
    }

    const itinerary = await Itinerary.create({
      tripId,
      days: daysData,
    });

    return new Response(JSON.stringify(itinerary), { status: 200 });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("Itinerary ERROR:", errMsg);
    return new Response(
      JSON.stringify({
        error: "Error generating itinerary",
        details: errMsg,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}