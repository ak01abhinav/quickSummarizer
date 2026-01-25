import { NextRequest, NextResponse } from "next/server";

// This function handles POST requests to /api/summarize
export async function POST(request: NextRequest) {
    try {
        // Extract the 'text' field from the incoming JSON body
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Get your Gemini API key from environment variables
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is not defined");
            return NextResponse.json({ error: "API configuration error" }, { status: 500 });
        }

        // Send a POST request to the Gemini API to summarize the text
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: `Summarize this:\n${text}` }], // prompt Gemini
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return NextResponse.json({ error: "Failed to fetch summary from Gemini" }, { status: response.status });
        }

        // Parse the response into JSON
        const data = await response.json();

        // Extract the summary text from the API response
        const output =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary found.";

        // Return the summary to the frontend as JSON
        return NextResponse.json({ summary: output });
    } catch (error) {
        // Handle and log any errors that occur during the request
        console.error("Error in API route:", error);

        // Return a 500 status error with a message
        return NextResponse.json({ error: "Failed to summarize." }, { status: 500 });
    }
}
