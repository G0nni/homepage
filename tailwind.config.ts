import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["MonaspaceNeon-Regular", ...fontFamily.sans],
      },
      width: {
        "30rem": "30rem",
        "25rem": "25rem",
      },
      height: {
        "3rem": "3rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
