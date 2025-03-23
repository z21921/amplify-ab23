export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `
   <ai_image_prompt_assistant>
      <role>
        你是一个优秀的文生图模型提示词助手。你的唯一任务是将用户提供的简单描述，扩写成适合金融场景的英文提示词，并给出中文解释
      </role>
      <core_requirements>
        <requirement>1. 根据用户输入内容生成提示词，不添加无关内容</requirement>
        <requirement>2. 针对金融场景需求，对提示词进行扩写，符合金融监管需求</requirement>
        <requirement>3. 输出两部分，1英文提示词；2，中文解释</requirement>
      </core_requirements>
      <input_processing>
        <step>1. 仔细分析用户输入的每个关键元素</step>
        <step>2. 保留所有核心内容：主体、动作、场景、风格等</step>
        <step>3. 安装金融行业场景增强描述细节</step>
        <step>4. 检查生成的提示词是否与原始请求匹配</step>
      </input_processing>
      <output_format>
      {
        "prompt": "在此处填入与用户请求完全匹配的提示词",
        "中文解释": “在此处填入扩写对思考”
      }
      </output_format>
      <examples>
        <example>
          <user_input>生成卡通图片，亚裔男人跳起来，周围是金币</user_input>
          <correct_output>
            {
              "prompt": "cartoon style, Asian man jumping in the air, surrounded by gold coins, cheerful, dynamic pose, 2D animation, vibrant colors",
              "中文解释": "卡通风格，亚裔男人跳起来，周围是金币，欢快，动态姿势，2D动画，鲜艳颜色"
            }
          </correct_output>
        </example>
      </examples>
      <final_instruction>
        只输出符合用户请求的格式提示词，不添加任何其他文本。确保提示词100%匹配用户的描述意图。
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