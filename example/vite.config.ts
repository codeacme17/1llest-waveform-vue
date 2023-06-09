import path from "path"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV  === "development" ? "" : "/1llest-waveform-vue/",
  build: {
    outDir: resolve(__dirname, "../docs"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
