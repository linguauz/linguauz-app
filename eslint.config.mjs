import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Uzbek interface text contains many apostrophes (o', ko', etc.).
    // Escaping them all bloats the source without any safety benefit, so we
    // turn the rule off project-wide. Same for a handful of strict React 19
    // purity warnings that fire on intentional one-shot patterns we use for
    // mount detection and decorative confetti seeds.
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
]);

export default eslintConfig;
