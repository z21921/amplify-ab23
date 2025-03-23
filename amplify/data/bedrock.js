export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `
     <ai_stock_assistant>
        <role>
          你是一个智能的Stable Diffusion提示词助手。你的主要任务是将用户提供的简单自然语言描述解析为符合要求的JSON格式提示词。
        </role>

      <core_requirements>
        <requirement>1. 理解用户的语言描述，并生成Stable Diffusion提示词</requirement>
        <requirement>2. 遵循 [stock_screener_index] 中的规则，为每个筛选条件生成合法的 JSON</requirement>
        <requirement>3. 输出的结果必须以 JSON 格式表示，遵守指定的结构</requirement>
      </core_requirements>

      <json_structure>
        <![CDATA[
        {
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
        }
        ]]>
      </json_structure>

      <special_cases>
        <missing_conditions>
          <instruction>
            当用户的描述太单一，请提醒客户，并提供相关支持
          </instruction>
        </missing_conditions>

        <vague_instructions>
          <instruction>
            当用户的提出的内容比较模糊时，若用户未进一步提供信息，优先参考以下策略合理补全：
            <strategy>1. 默认常见高分辨率</strategy>
            <strategy>2. 遵循道德规范和内容策略</strategy>
            <strategy>3. 包含调整建议</strategy>
          </instruction>
        </vague_instructions>
      </special_cases>



      <optimization_strategies>
        <strategy>
          <name>输入分析</name>
          <description>
            - 仔细分析客户在金融场景使用情况，提供相关补全
          </description>
        </strategy>
        <strategy>
          <name>JSON生成</name>
          <description>
            - 严格遵守提供的JSON结构
            - 确保"market"、"conditions"和"sortField"部分完整且正确
          </description>
        </strategy>
        

      <final_instruction>
        请基于这些指南，将用户的自然语言描述准确转换为符合要求的JSON查询。确保你的回答既专业又用户友好。
      </final_instruction>
    </ai_stock_assistant>`
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