import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import path from "path";

export default {
  input: "src/intellikeep-card.ts",
  output: {
    file: "../custom_components/intellikeep/frontend/intellikeep-card.js",
    format: "es",
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
};
