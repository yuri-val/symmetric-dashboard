import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6789,
    host: "0.0.0.0", // Allow connections from outside the container
    proxy: {
      "/api": "http://localhost:3322", // Point to the Express server
    },
  },
});
