// @ts-check
const { withUt } = require("uploadthing/tw");
 
module.exports = withUt({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
