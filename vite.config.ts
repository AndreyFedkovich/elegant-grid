import { defineConfig, type LibraryFormats } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // Library build mode
  if (mode === "library") {
    const dts = (await import("vite-plugin-dts")).default;
    
    return {
      plugins: [
        react(),
      dts({
        include: [path.resolve(__dirname, "src/components/ElegantGrid/**/*")],
        exclude: ["**/*.test.*", "**/*.spec.*", "node_modules/**", "eslint.config.js"],
        outDir: "dist",
        rollupTypes: true,
        tsconfigPath: path.resolve(__dirname, "tsconfig.app.json"),
      }),
      ],
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/components/ElegantGrid/index.ts"),
          name: "ElegantGrid",
          fileName: (format: string) => `elegant-grid.${format}.js`,
          formats: ["es", "cjs"] as LibraryFormats[],
        },
        rollupOptions: {
          external: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "lucide-react",
            "tailwind-merge",
            "clsx",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "class-variance-authority",
          ],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "ReactJSXRuntime",
              "lucide-react": "LucideReact",
            },
          },
        },
        sourcemap: true,
        emptyOutDir: true,
        cssCodeSplit: false,
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
    };
  }

  // Development mode (default)
  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
