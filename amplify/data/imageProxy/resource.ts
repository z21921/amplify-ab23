import { defineFunction } from "@aws-amplify/backend";

export const imageProxy = defineFunction({
  name: "imageProxy",
  entry: "./handler.ts",
}); 