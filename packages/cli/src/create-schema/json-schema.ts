import serializeJavascript from "serialize-javascript";
import Ajv from "ajv";
import AjvFormats from "ajv-formats";
import { parse } from "dotenv";
import { CreateSchema, CreateSchemaReturnType } from "../create-schema";
import { readFileSync } from "fs";
import { compile } from "json-schema-to-typescript";

export const createSchemaForJSONSchema: CreateSchema = async ({
  globalVariableName,
  envSchemaFilePath,
  envFilePath,
  userEnvironment,
}) => {
  return <CreateSchemaReturnType>{
    generateJs: async () => {
      const ajv = new Ajv({
        allErrors: true,
        strict: true,
        coerceTypes: false,
      });
      AjvFormats(ajv);
      const envSchemaFileContent = readFileSync(envSchemaFilePath, "utf8");
      const envSchemaFileJSON = JSON.parse(envSchemaFileContent);
      const env = (() => {
        let env: Record<string, string> = {};
        if (envFilePath !== null) {
          const envFileContent = readFileSync(envFilePath, "utf8");
          const envFileJSON = parse(envFileContent);
          env = { ...env, ...envFileJSON };
        }
        if (userEnvironment) {
          env = { ...env, ...(process.env as Record<string, string>) };
        }
        return env;
      })();

      if (envSchemaFileJSON.type !== "object") {
        throw Error('schema is invalid: data/type must be "object"');
      }
      if (
        Object.getPrototypeOf(envSchemaFileJSON.properties ?? "")
          .constructor !== Object
      ) {
        throw Error("schema is invalid: data/properties must be object");
      }

      const parsedEnv: Record<string, any> = {};
      Object.keys(envSchemaFileJSON.properties).forEach((property) => {
        const value = env[property];
        if (envSchemaFileJSON.properties[property].type === "string") {
          const propertySchema = {
            type: envSchemaFileJSON.type,
            properties: {
              [property]: envSchemaFileJSON.properties[property],
            },
            required: (envSchemaFileJSON.required ?? []).includes(property)
              ? [property]
              : [],
          };
          if (ajv.validate(propertySchema, { [property]: value }) === false) {
            throw Error(JSON.stringify(ajv.errors));
          }
          parsedEnv[property] =
            typeof value === "string" ? serializeJavascript(value) : undefined;
        } else {
          const parsedValue = (() => {
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          })();
          const propertySchema = {
            type: envSchemaFileJSON.type,
            properties: {
              [property]: envSchemaFileJSON.properties[property],
            },
            required: (envSchemaFileJSON.required ?? []).includes(property)
              ? [property]
              : [],
          };
          if (
            ajv.validate(propertySchema, { [property]: parsedValue }) === false
          ) {
            throw TypeError(JSON.stringify(ajv.errors));
          }
          parsedEnv[property] = JSON.stringify(parsedValue);
        }
      });

      const content = [
        "// Generated by '@runtime-env/cli'",
        "",
        `globalThis.${globalVariableName} = {`,
        ...Object.entries(parsedEnv).map(
          ([key, value]) => `  "${key}": ${value},`,
        ),
        "}",
        "",
      ].join("\n");
      return content;
    },
    generateTs: async () => {
      const envSchemaFileContent = readFileSync(envSchemaFilePath, "utf8");
      const envSchemaFileJSON = JSON.parse(envSchemaFileContent);
      const result = await compile(envSchemaFileJSON, globalVariableName, {
        bannerComment: `
// Generated by '@runtime-env/cli'

type Primitive = undefined | null | boolean | string | number

type Immutable<T> =
  T extends Primitive ? T :
    T extends Array<infer U> ? ReadonlyArray<U> :
      Readonly<T>

type DeepImmutable<T> =
  T extends Primitive ? T :
    T extends Array<infer U> ? DeepImmutableArray<U> :
      DeepImmutableObject<T>

interface DeepImmutableArray<T> extends ReadonlyArray<DeepImmutable<T>> {}

type DeepImmutableObject<T> = {
  readonly [K in keyof T]: DeepImmutable<T[K]>
}
        `,
        additionalProperties: false,
      });
      return (
        result
          .replace(
            /export interface (\S+) /,
            `declare const ${globalVariableName}: DeepImmutable<`,
          )
          .trim() + ">\n"
      );
    },
  };
};
