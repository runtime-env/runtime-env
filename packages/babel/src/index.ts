import { declare } from "@babel/helper-plugin-utils";
import type babelCore from "@babel/core";
import { resolveEnv, accessor } from "../../shared";
import { resolveEnvExampleKeys } from "../../shared/resolve-env-example-keys";
import { PluginOptions } from "./types";

export default declare<PluginOptions>(({ template, types }, options) => {
  const transformMode: "compile-time" | "runtime" =
    options.transformMode ??
    (process.env.NODE_ENV === "production"
      ? ("runtime" as const)
      : ("compile-time" as const));

  const envExampleKeys = resolveEnvExampleKeys({
    envExampleFilePath: options.example,
  });

  const env =
    transformMode === "compile-time"
      ? (() => {
          return resolveEnv({
            envExampleFilePath: options.example,
            envFilePath: options.env,
          });
        })()
      : Object.create(null);

  const replaceEnvForCompileTime = (
    template: typeof babelCore.template,
    property: string,
  ) => template.expression.ast(JSON.stringify(env[property]));
  const replaceEnvForRuntime = (
    template: typeof babelCore.template,
    property: string,
  ) => template.expression.ast(`${accessor}.${property}`);

  return {
    name: "@import-meta-env/babel",
    visitor: {
      Identifier(path, state) {
        if (!types.isIdentifier(path)) return;

        // {}.{}
        if (!types.isMemberExpression(path.parentPath)) return;
        // {}.{}.{}
        if (!types.isMemberExpression(path.parentPath.node)) return;
        // {}.{}.{}.{}
        if (!types.isMemberExpression(path.parentPath.node.object)) return;

        // {}.{}.{}.PROPERTY
        if (path.parentPath.computed) return;
        if (!types.isIdentifier(path.parentPath.node.property)) return;

        // {}.{}.env.PROPERTY
        if (!types.isIdentifier(path.parentPath.node.object.property)) return;
        if (path.parentPath.node.object.property.name !== "env") return;

        // import.meta.env.PROPERTY
        if (!types.isMetaProperty(path.parentPath.node.object.object)) return;
        if (path.parentPath.node.object.object.property.name !== "meta") return;
        if (path.parentPath.node.object.object.meta.name !== "import") return;

        // import.meta.env.PUBLIC_PROPERTY
        if (
          envExampleKeys.includes(path.parentPath.node.property.name) === false
        )
          return;

        if (transformMode === "compile-time") {
          path.parentPath.replaceWith(
            replaceEnvForCompileTime(
              template,
              path.parentPath.node.property.name,
            ),
          );
        } else {
          path.parentPath.replaceWith(
            replaceEnvForRuntime(template, path.parentPath.node.property.name),
          );
        }
      },
    },
  };
});
