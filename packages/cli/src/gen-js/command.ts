import { Command, program } from "commander";
import act from "./act";
import { writeFileSync } from "fs";

export default () => {
  return new Command("gen-js")
    .description(
      "generate a JavaScript file that includes environment variables within an object, making them accessible through the globalThis property",
    )
    .option(
      "--output-file <outputFile>",
      "specify the output file to be written instead of being piped to stdout",
    )
    .action(async ({ outputFile }) => {
      const { globalVariableName, schemaFile } = program.opts();

      const { output } = await act({
        schemaFile,
        globalVariableName,
      });

      if (outputFile) {
        writeFileSync(outputFile, output, "utf8");
      } else {
        console.log(output);
      }
    });
};
