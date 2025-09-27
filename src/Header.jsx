export default function Header() {
	return (
		<header>
			<div className="header-container">
				<img
					src="/parrot.svg"
					alt="pollyglot logo image"
					className="logo-img"
				/>
				<div className="header-wrap">
					<h1 className="header-title">PollyGlot</h1>
					<h2 className="header-subtitle">Perfect Translation Every Time</h2>
				</div>
			</div>
		</header>
	);
}
