import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/event-uploader/", // 👈 Set this to match your GitHub repo name
});
