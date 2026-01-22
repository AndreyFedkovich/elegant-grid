import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Library build mode
  if (mode === "library") {
    return {
      plugins: [
        react(),
        dts({
          include: ["src/components/ElegantGrid/**/*"],
          outDir: "dist",
          rollupTypes: true,
        }),
      ],
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/components/ElegantGrid/index.ts"),
          name: "ElegantGrid",
          fileName: (format) => `elegant-grid.${format}.js`,
          formats: ["es", "cjs"] as const,
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
