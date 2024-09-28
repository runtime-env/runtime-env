import { program } from "commander";
import { version } from "../package.json";
import commandGenJs from "./gen-js/command";
import commandGenTs from "./gen-ts/command";
import commandInterpolate from "./interpolate/command";

program
  .version(version)
  .option(
    "--global-variable-name <globalVariableName>",
    "specify the global variable name",
    "runtimeEnv",
  )
  .option(
    "--schema-file <schemaFile>",
    "specify the json schema file to be loaded",
    ".runtimeenvschema.json",
  )
  .addCommand(commandGenJs())
  .addCommand(commandGenTs())
  .addCommand(commandInterpolate())
  .parse();
