import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const promptOtKey = process.env.PROMPTOT_API_KEY;
        const promptOtId = process.env.PROMPTOT_CHAT_PROMPT_ID;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is not defined");
            return NextResponse.json({ error: "API configuration error" }, { status: 500 });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        // Format history for Gemini. We need to map 'user'/'assistant' roles to 'user'/'model'.
        const formattedMessages = messages.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        // Fallback default message in case PromptOT integration fails or isn't set up yet
        let systemPromptText = "System directive: You are the helpful AI assistant for 'quickSummarizer'. You must answer user queries about quickSummarizer's features, capabilities, and limitations. Specifically: quickSummarizer transforms long articles, documents, or URLs into concise, actionable insights in seconds using advanced AI. You should be polite, clear, and direct. Only answer questions related to summarizing, productivity, and the app's features. If asked about unrelated topics, politely redirect them back to quickSummarizer's functionality.";

        if (promptOtKey && promptOtId && promptOtKey !== "pot_placeholder_key") {
            console.log("fetching prompt from promptot>>>>>>>>>>>");
             try {
                 const promptOtResponse = await fetch(
                     `https://api.promptot.com/api/v1/prompts/${promptOtId}`,
                     {
                         method: "GET",
                         headers: {
                             "Authorization": `Bearer ${promptOtKey}`,
                             "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
                         },
                         next: { revalidate: 3600 }
                     }
                 );

                 console.log("response>>>>>>>>>>>>>>", promptOtResponse);

                 if (promptOtResponse.ok) {
                     const promptData = await promptOtResponse.json();
                     // Debug: log the full response to see the actual structure
                     console.log("PromptOT Response:", JSON.stringify(promptData, null, 2));

                     // Extract the prompt from the exact field name in the PromptOT response
                     const extracted = promptData?.data?.compiled_prompt;

                     if (extracted && typeof extracted === "string") {
                         systemPromptText = extracted;
                         console.log("✅ Using PromptOT prompt successfully.");
                     } else {
                         console.warn("⚠️ PromptOT returned data but no known text field was found. Falling back to default prompt.");
                     }
                 } else {
                     console.error(`PromptOT Error: ${promptOtResponse.status} - ${promptOtResponse.statusText}`);
                     const errorData = await promptOtResponse.text();
                     console.error("PromptOT Error Details:", errorData);
                 }
             } catch (error) {
                 console.error("Failed to fetch from PromptOT:", error);
             }
        }

        const systemMessage = {
             role: "user",
             parts: [
                 {
                     text: systemPromptText,
                 },
             ]
        };

        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        systemMessage,
                        ...formattedMessages
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API Error:", errorData);
            return NextResponse.json({ error: "Failed to fetch response from Gemini" }, { status: response.status });
        }

        const data = await response.json();

        const output =
            data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

        return NextResponse.json({ reply: output });
    } catch (error) {
        console.error("Error in chat API route:", error);
        return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
    }
}
