import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const babel = require("@babel/core") as {
  transformSync: (
    source: string,
    options: object,
  ) => { code?: string | null } | null;
};
export default defineConfig({
  plugins: [
    {
      name: "verify-shared-ui-with-react-compiler",
      enforce: "pre",
      transform(source, id) {
        // Exercise the compiler in shared UI tests too: source-only rendering
        // misses collisions with generated Symbol.for cache sentinels.
        const path = id.replaceAll("\\", "/");
        if (
          !path.endsWith("/src/app/workspace-ui.tsx") &&
          !path.endsWith("/src/app/landing-how.tsx") &&
          !path.endsWith("/src/app/mimo-mascot.tsx")
        )
          return;
        return (
          babel.transformSync(source, {
            filename: id,
            configFile: false,
            babelrc: false,
            parserOpts: { plugins: ["typescript", "jsx"] },
            plugins: [
              [require("babel-plugin-react-compiler"), { target: "19" }],
            ],
          })?.code || undefined
        );
      },
    },
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    fileParallelism: false,
    maxWorkers: 1,
    include: ["tests/**/*.test.{ts,tsx}"],
    clearMocks: true,
  },
});
