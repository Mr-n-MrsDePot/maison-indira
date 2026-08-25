import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES === "1" ? "/maison-indira/" : "/",
  server: { port: 5222, strictPort: true },
  preview: { port: 5222, strictPort: true },
});
