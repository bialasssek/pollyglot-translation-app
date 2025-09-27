import Header from "./Header";
import Content from "./Content";
import AppChat from "./AppChat";
import { Routes, Route, Link } from "react-router-dom";

export default function App() {
	return (
		<>
			<Header />
			<nav className="nav-container">
				<div className="nav-links">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<span className="nav-divider">|</span>
					<Link to="/chat" className="nav-link">
						Chat
					</Link>
				</div>
			</nav>
			<Routes>
				<Route path="/" element={<Content />} />
				<Route path="/chat" element={<AppChat />} />
			</Routes>
		</>
	);
}
