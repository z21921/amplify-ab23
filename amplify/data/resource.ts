import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { generateImage } from "./generateImage/resource";

// Define a separate type for prompt
const PromptType = a.customType({
  text: a.string(),
  mode: a.string(),
});

const schema = a.schema({
  BedrockResponse: a.customType({
    body: a.string(),
    error: a.string(),
  }),

  // API response for the image proxy
  ImageProxyResponse: a.customType({
    base64_image: a.string(),
    error: a.string(),
  }),

  // The input type for the prompt
  Prompt: PromptType,

  askBedrock: a
    .query()
    .arguments({ ingredients: a.string().array() })
    .returns(a.ref("BedrockResponse"))
    .authorization((allow) => [allow.authenticated()])
    .handler(
      a.handler.custom({ entry: "./bedrock.js", dataSource: "bedrockDS" })
    ),
  generateImage: a
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string().array())
    .handler(a.handler.function(generateImage))
    .authorization((allow) => [allow.authenticated()]),
  
  imageProxy: a
    .query()
    .arguments({
      prompt: a.ref("Prompt"),
      token: a.string(),
    })
    .returns(a.ref("ImageProxyResponse"))
    .handler(
      a.handler.custom({ entry: "./imageProxy/handler.js", functionName: "imageProxy" })
    )
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});