import { Command } from "commander";
import { version } from "../package.json";
import commandGenJs from "./gen-js/command";
import commandGenTs from "./gen-ts/command";

new Command()
  .version(version)
  .addCommand(commandGenJs())
  .addCommand(commandGenTs())
  .parse();
