import { useState } from "react";

export default function Content() {
	const [isTranslated, setIsTranslated] = useState(false);
	const [translatedText, setTranslatedText] = useState("");
	const [toBeTranslatedText, setToBeTranslatedText] = useState("");
	function handleSubmit(formData) {
		const inputText = formData.get("translateText");
		setToBeTranslatedText(inputText);
		const selectedLang = formData.get("language");

		if (isTranslated) {
			setIsTranslated(false);
			setTranslatedText("");
			setToBeTranslatedText("");
			return;
		}

		fetch("/.netlify/functions/translate", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: inputText,
				language: selectedLang,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(
					`Translate the following text into ${selectedLang}: ${inputText}`
				);

				setTranslatedText(data.translatedText);
				setIsTranslated(true);
			})
			.catch((err) => console.log(err));
	}

	return (
		<main>
			<section className="translate">
				<form action={handleSubmit} className="translate-form">
					{isTranslated ? (
						<>
							<label className="translate-header">Text to translate 👇</label>
							<input
								type="text"
								name="translateText"
								defaultValue={toBeTranslatedText}
								className="translate-input"
							/>
							<label
								htmlFor="translatedText"
								className="translate-header translate-header-lang"
							>
								Your translation 👇
							</label>
							<div className="translate-input">
								<p>{translatedText}</p>
							</div>
						</>
					) : (
						<>
							<label className="translate-header">Text to translate 👇</label>
							<input
								type="text"
								name="translateText"
								placeholder="How are you?"
								className="translate-input"
								required
							/>
							<label
								htmlFor="radioInput"
								className="translate-header translate-header-lang"
							>
								Select Language 👇
							</label>

							<label htmlFor="radioInput" className="label-language">
								<input
									type="radio"
									name="language"
									value="french"
									className="radioInput"
									required
								/>
								<p>French</p>
								<img src="/fr-flag.svg" alt="french flag" />
							</label>

							<label htmlFor="radioInput" className="label-language">
								<input
									type="radio"
									name="language"
									value="spanish"
									className="radioInput"
									required
								/>
								<p>Spanish</p>
								<img src="/sp-flag.svg" alt="spanish flag" />
							</label>

							<label htmlFor="radioInput" className="label-language">
								<input
									type="radio"
									name="language"
									value="japanese"
									className="radioInput"
									required
								/>
								<p>Japanese</p>
								<img src="/jpn-flag.svg" alt="japanese flag" />
							</label>
						</>
					)}
					<button className="translate-btn" type="submit">
						{isTranslated ? "Start Over" : "Translate"}
					</button>
				</form>
			</section>
		</main>
	);
}
