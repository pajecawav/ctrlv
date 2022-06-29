/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./web/index.html", "./web/**/*.{vue,js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			animation: {
				"spin-fast": "spin 0.5s linear infinite",
			},
		},
	},
	plugins: [],
};
