import ThemeToggle from "./ThemeToggle.tsx";
import "./Header.scss";

type HeaderProps = {
    onLogout: () => void;
    showLogout: boolean;
};

export default function Header ({ onLogout, showLogout }: HeaderProps) {

return (
	<header className = "app-header">
	<div className = "app-header__brand">
		<span className = "app-header__logo">▣</span>
		<h1> StockKeeps </h1>
	</div>
	<div className  = "app-header__actions">
		<ThemeToggle />
		{showLogout && (
		<button className = "btn-ghost" onClick = {onLogout}>
		Log Out
		</button>
	)}
	</div>
	</header>
);
}