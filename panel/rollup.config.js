import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/intellikeep-panel.ts",
  output: {
    file: "../custom_components/intellikeep/frontend/intellikeep-panel.js",
    format: "es",
  },
  plugins: [resolve(), typescript({ tsconfig: "./tsconfig.json" })],
};
