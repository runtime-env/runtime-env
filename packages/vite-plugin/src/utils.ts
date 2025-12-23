import { existsSync } from "fs";
import { resolve } from "path";

export function isTypeScriptProject(root: string): boolean {
  return existsSync(resolve(root, "tsconfig.json"));
}
