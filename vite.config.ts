import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { checkoutPlugin } from "./server/plugin.ts";

export default defineConfig({
  plugins: [react(), checkoutPlugin()],
  base: process.env.GITHUB_PAGES === "1" ? "./" : "/",
  server: { port: 5222, strictPort: true },
  preview: { port: 5222, strictPort: true },
});
