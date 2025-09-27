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

		fetch("/.netlify/functions/translate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: userMessage,
				language: selectedLang,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(
					`Translate the following text into ${selectedLang}: ${userMessage}`
				);

				setMessages((prevMessages) => [
					...prevMessages,
					{ text: data.translatedText, sender: "chat" },
				]);
			})
			.catch((err) => console.log(err));
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
