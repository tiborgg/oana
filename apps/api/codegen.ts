import "reflect-metadata";
import { printSchema } from "graphql";
import { schema } from "./src/schema";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: printSchema(schema),
  // documents: ["./src/**/*.ts"],
  generates: {
    "../../packages/graphql/src/.generated/": {
      preset: "client",
      plugins: [],
    },
    "../../packages/graphql/src/.generated/schema.graphql": {
      plugins: ["schema-ast"],
    },
  },
};

export default config;
