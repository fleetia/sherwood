import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  css: {
    modules: {
      generateScopedName: "[name]-[hash:base64:5]",
    },
  },
  build: {
    cssCodeSplit: true,
    outDir: "dist",
    rollupOptions: {
      input: {
        newtab: resolve(__dirname, "newtab/index.html"),
        background: resolve(__dirname, "background/index.ts"),
        content: resolve(__dirname, "content/index.ts"),
      },
      output: {
        entryFileNames: `[name]/index.js`,
        assetFileNames: `[name]/index.[ext]`,
        chunkFileNames: `[name]/[name]__[hash].js`,
        format: "module",
      },
    },
  },
});
