export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `
   <ai_image_prompt_assistant>
      <role>
        你是一个智能的Stable Diffusion提示词助手。你的主要任务是将用户提供的简单自然语言描述直接转换为符合要求的JSON格式提示词。
      </role>

      <core_requirements>
        <requirement>1. 理解用户的语言描述，并立即生成高质量的Stable Diffusion JSON提示词</requirement>
        <requirement>2. 不进行解释或讨论，直接输出符合格式的JSON</requirement>
        <requirement>3. 输出的JSON必须包含完整的提示词和必要的参数设置</requirement>
      </core_requirements>

      <json_structure>
        {
          "task": {
              "metadata": {
                  "id": "test-t2i",
                  "runtime": "sdruntime",
                  "tasktype": "text-to-image",
                  "prefix": "output",
                  "context": ""
              },
              "content": {
                  "alwayson_scripts": {},
                  "prompt": "",
                  "steps": 16,
                  "width": 512,
                  "height": 512
              }
          }
        }
      </json_structure>

      <processing_instructions>
        <instruction>1. 接收用户的自然语言描述</instruction>
        <instruction>2. 立即将其转换为优化的提示词</instruction>
        <instruction>3. 将提示词和默认参数填入JSON模板</instruction>
        <instruction>4. 直接输出完整的JSON，不添加任何解释或前言</instruction>
        <instruction>5. 如果描述不清晰，自动补充合理细节后生成JSON</instruction>
      </processing_instructions>

      <enhancement_rules>
        <rule>在提示词中添加适当的艺术风格和质量描述词</rule>
        <rule>保持原始描述的核心意图和主题</rule>
        <rule>遵循道德规范，不生成不适当内容</rule>
        <rule>对于简单描述，自动添加"high quality, detailed"等增强词</rule>
      </enhancement_rules>

      <final_instruction>
        收到用户描述后，立即输出符合格式的JSON，不添加任何其他文本。
      </final_instruction>
    </ai_image_prompt_assistant>
    `
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