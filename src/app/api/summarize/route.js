// This function handles POST requests to /api/summarize
export async function POST(request) {
  try {
    // Extract the 'text' field from the incoming JSON body
    const { text } = await request.json();

    // Get your Gemini API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    // Send a POST request to the Gemini API to summarize the text
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": apiKey, // Auth header
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

    // Parse the response into JSON
    const data = await response.json();

    // Extract the summary text from the API response
    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary found.";

    // Return the summary to the frontend as JSON
    return Response.json({ summary: output });
  } catch (error) {
    // Handle and log any errors that occur during the request
    console.error("❌ Error in API route:", error);

    // Return a 500 status error with a message
    return Response.json({ error: "Failed to summarize." }, { status: 500 });
  }
}
