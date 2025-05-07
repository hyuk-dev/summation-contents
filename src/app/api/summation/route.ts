import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const webpage = await fetch(url);
    const html = await webpage.text();

    // OpenAI API 요청
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes webpages.",
          },
          {
            role: "user",
            content: `Summarize the following content:\n\n${html.slice(
              0,
              30000
            )}`,
          },
        ],
      }),
    });

    const data = await res.json();
    const summary =
      data.choices?.[0]?.message?.content ?? "No summary generated.";

    return NextResponse.json({ summary });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to summarize content." },
      { status: 500 }
    );
  }
}
