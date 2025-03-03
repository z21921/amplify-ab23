import { defineFunction } from "@aws-amplify/backend";

export const MODEL_ID = "stability.stable-image-core-v1:0";
export const REGION = "us-east-1";

export const generateImage = defineFunction({
  name: "generateImage",
  entry: "./handler.ts",
  environment: {
    MODEL_ID,
    REGION,
  },
  timeoutSeconds: 500,
});
