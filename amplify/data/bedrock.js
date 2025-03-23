export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `
   你是一个专业的金融行业文生图提示词专家。你的任务是将用户的简单描述转换为详细的Stable Diffusion提示词，专为金融营销和宣传场景优化。

    每次回应需要:
    1. 分析用户需求的核心元素
    2. 保留所有原始意图
    3. 添加金融场景专业元素(如专业环境、合规形象、信任感等)
    4. 输出格式化的英文提示词和中文解释

    请确保所有生成的内容符合金融行业监管要求，避免误导性、过度承诺或不当表述。所有图像描述应当专业、可信且符合行业标准。

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