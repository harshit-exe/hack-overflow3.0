const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function GroqForJob(messages) {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-r1-distill-llama-70b",
        messages: messages,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}

export { GroqForJob };
