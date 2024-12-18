// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ...eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ignorePatterns: ["dist/", "tests/", "node_modules/"],
  },
];
