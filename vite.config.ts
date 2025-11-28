import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          try {
            if (id.includes("node_modules")) {
              // let name = id.split("node_modules/")[1].split("/");
              // if (name[0] == ".pnpm") {
              //   return name[1];
              // } else {
              //   return name[0];
              // }
              return "packages";
            }
          }
          catch (error) {
            console.error(error);
          }
        },
      },
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: resolve(__dirname, "./src") },
      {
        find: "@src-runtime",
        replacement: resolve(__dirname, "./src-runtime"),
      },
    ],
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
});
