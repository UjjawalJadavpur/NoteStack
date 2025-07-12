export async function POST(req) {
  try {
    const { content } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "Missing Gemini API key." }, { status: 401 });
    }

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Suggest improvements or ideas for this note:\n\n${content}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    if (data.error) {
      console.error("Gemini API error:", data.error);
      return Response.json({ error: data.error.message }, { status: 500 });
    }

    const suggestion =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No suggestions available.";

    return Response.json({ suggestion });
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return Response.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
