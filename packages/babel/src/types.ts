export interface PluginOptions {
  /**
   * The .env file path to load
   *
   * You can out-out this by passing an empty string
   *
   * @default ".env"
   */
  env?: string;

  /**
   * The public .env example file path to load
   */
  example: string;

  /**
   * Compile-time: statically replace `import.meta.env.KEY` with `"value"`
   * Runtime: statically replace `import.meta.env` with a global accessor
   *
   * @default
   * process.env.NODE_ENV === "production" ? "runtime" : "compile-time"
   */
  transformMode?: "compile-time" | "runtime";
}
