import { useState, useRef, useEffect } from "react";
import OpenAI from "openai";
import { nanoid } from "nanoid";

export default function AppChat() {
	const [messages, setMessages] = useState([]);
	const conversationRef = useRef(null);
	const [selectedLang, setSelectedLang] = useState("french");
	useEffect(() => {
		if (conversationRef.current) {
			conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
		}
	}, [messages]);

	function handleSubmit(formData) {
		const userMessage = formData.get("userMessage");
		if (!userMessage) return;

		setMessages((prevMessages) => [
			...prevMessages,
			{ text: userMessage, sender: "user" },
		]);

		const openai = new OpenAI({
			baseURL: "https://openrouter.ai/api/v1",
			apiKey:
				"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",
			dangerouslyAllowBrowser: true,
		});

		async function main() {
			const completion = await openai.chat.completions
				.create({
					model: "x-ai/grok-4-fast:free",
					messages: [
						{
							role: "assistant",
							content:
								"You are a professional translator. Translate the text provided by the user into the target language selected by the application. Maintain the original meaning and tone. Do not add explanations or comments. Output only the translated text without quotes or extra formatting",
						},
						{
							role: "user",
							content: `The user said: ${userMessage}, translate it into ${selectedLang}.`,
						},
					],
				})
				.catch((err) => console.log(err));

			setMessages((prevMessages) => [
				...prevMessages,
				{ text: completion.choices[0].message.content, sender: "chat" },
			]);
		}
		main();
	}

	return (
		<main>
			<section className="chat">
				<div className="conversation" ref={conversationRef}>
					<p className="message chat-message">
						Select the language you me to translate into, type your text and hit
						send!
					</p>
					{/* <p className="message user-message">How are you?</p>
					<p className="message chat-message">Comment allez-vous?</p> */}
					{messages.map((message) => (
						<p
							key={nanoid()}
							className={`message ${
								message.sender === "user" ? "user" : "chat"
							}-message`}
						>
							{message.text}
						</p>
					))}
				</div>
				<form action={handleSubmit} className="chat-form">
					<input
						type="text"
						name="userMessage"
						className="chat-input"
						required
					/>
					<img src="/send-btn.svg" alt="send icon" />
				</form>
				<div className="chat-flags">
					<img
						src="/fr-flag.svg"
						className={`flag ${selectedLang === "french" ? "selected" : ""}`}
						alt="french flag"
						onClick={() => setSelectedLang("french")}
					/>
					<img
						src="/sp-flag.svg"
						className={`flag ${selectedLang === "spanish" ? "selected" : ""}`}
						alt="spanish flag"
						onClick={() => setSelectedLang("spanish")}
					/>
					<img
						src="/jpn-flag.svg"
						className={`flag ${selectedLang === "japanese" ? "selected" : ""}`}
						alt="japanese flag"
						onClick={() => setSelectedLang("japanese")}
					/>
				</div>
			</section>
		</main>
	);
}
