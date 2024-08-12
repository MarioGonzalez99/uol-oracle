'use client';
import { useState } from 'react';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';

const themes = {
	light: "lemonade",
	dark: "dracula",
};

const ThemeToggle = () => {
	const [theme, setTheme] = useState(themes.dark);
	const toggleTheme = () => {
		const selectedTheme = theme === themes.dark ? themes.light : themes.dark;
		document.documentElement.setAttribute('data-theme', selectedTheme);
		setTheme(selectedTheme);
	};
	return (
		<button onClick={toggleTheme} className="btn btn-sm btn-outline">
			{theme === 'dracula' ? (
				<BsSunFill className="h-4 w-4" />
			) : (
				<BsMoonFill className="h-4 w-4" />
			)}
		</button>
	);
};

export default ThemeToggle;
