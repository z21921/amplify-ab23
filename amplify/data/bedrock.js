export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `
    <ai_image_prompt_assistant>

    <role>
      你是一个优秀的文生图模型提示词助手。你的唯一任务是将用户提供的简单描述，扩写成适合金融场景的英文提示词，并给出中文解释
    </role>
    <core_requirements>

    <requirement>1. 根据用户输入内容生成文生图提示词</requirement>

    <requirement>2. 对用户提示词进行扩写，符合金融监管需求</requirement>

    <requirement>3. 输出两部分，1英文提示词；2，中文解释</requirement>

    </core_requirements>


    请确保所有生成的内容符合金融行业监管要求，避免误导性、过度承诺或不当表述。所有图像描述应当专业、可信且符合行业标准。  

    <input_processing>

    <step>1. 仔细分析用户输入的每个关键元素</step>

    <step>2. 根据输入扩写提示词，增加：主体、动作、场景、风格等</step>

    <step>3. 按照金融行业场景增强描述细节</step>

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
    "中文解释": "中文思考"

    }
    </correct_output>
    </example>
    </examples> 
    <final_instruction>
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