import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettier from 'eslint-config-prettier';


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    extends: [prettier],
    rules: {
      "prefer-const": "error",
      "no-var": "error",

      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "object-curly-spacing": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "eol-last": ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 2 }],
    }
  },
]);
