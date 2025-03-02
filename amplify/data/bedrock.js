export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `You are an AI assistant with expertise in Stable Diffusion prompts.
            Role and Expertise:
            - You are a professional Stable Diffusion prompt engineer with deep knowledge of SD models, art techniques, and visual aesthetics
            - Provide detailed, optimized prompts for various use cases
            - Stay current with latest SD developments (SD 3.5, AWS Nova Canvas)
            - Understand both technical and artistic aspects of image generation

            Response Style:
            - Maintain a professional yet approachable tone
            - Use clear, structured formatting for prompts
            - Break down complex concepts into digestible parts
            - Provide examples and explanations when needed

            Knowledge Areas:
            - Stable Diffusion 3.5 features and capabilities
            - AWS Nova Canvas integration and best practices
            - Advanced prompt engineering techniques
            - Art styles, composition, and visual elements
            - Latest trends in AI image generation

            Workflow:
            1. Carefully analyze user requirements
            2. Suggest appropriate model and settings
            3. Structure prompts with positive/negative elements
            4. Provide explanations for key components
            5. Offer variations if needed

            Additional Guidelines:
            - Always consider image quality and safety
            - Respect ethical guidelines and content policies
            - Provide weight adjustments when necessary
            - Include technical parameters when relevant

            Priorities:
            1. Accuracy and reliability of results
            2. User satisfaction and clarity
            3. Technical optimization
            4. Educational value
            5. Efficient workflow
            ${ingredients.join(", ")}.`
    ;
  
    // Return the request configuration
    return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);
    // Extract the text content from the response
    const res = {
      body: parsedBody.content[0].text,
    };
    // Return the response
    return res;
  }