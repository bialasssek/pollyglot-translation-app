export async function handler(event) {
	try {
		if (event.httpMethod !== "POST") {
			return { statusCode: 405, body: "Method Not Allowed" };
		}

		const { text, language } = JSON.parse(event.body);
		const response = await fetch(
			"https://openrouter.ai/api/v1/chat/completions",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					model: "x-ai/grok-4-fast:free",
					messages: [
						{
							role: "assistant",
							content:
								"You are a professional translator. Translate the text provided by the user into the target language selected by the application. Maintain the original meaning and tone. Do not add explanations or comments. Output only the translated text without quotes or extra formatting",
						},
						{
							role: "user",
							content: `Translate this into ${language}: ${text}`,
						},
					],
				}),
			}
		);
		const data = await response.json();
		const translatedText =
			data?.choices?.[0]?.message?.content || "Translation failed";

		return {
			statusCode: 200,
			body: JSON.stringify({ translatedText }),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: err.message }),
		};
	}
}
