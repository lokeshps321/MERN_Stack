export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14120f",
        sand: "#f6f1e8",
        ember: "#d9732a",
        moss: "#2f6f63",
        blush: "#f4c7a8"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Sora", "sans-serif"]
      },
      boxShadow: {
        premium: "0 30px 80px -40px rgba(20, 18, 15, 0.35)"
      }
    }
  },
  plugins: []
};
