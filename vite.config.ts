import { defineConfig } from "vite";
import vercel from "vite-plugin-vercel";

export default defineConfig({
  base: "./",
  plugins: [vercel()],
  // build: {
  //   minify: "terser",
  // },
});
