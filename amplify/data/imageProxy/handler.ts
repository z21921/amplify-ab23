import axios from 'axios';
import type { Schema } from "../resource";

type ImageProxyEvent = {
  arguments: {
    prompt: {
      text: string;
      mode: string;
    };
    token: string;
  };
};

export const handler = async (event: ImageProxyEvent) => {
  try {
    // Forward the request to the external API
    const response = await axios.post(
      'https://z94wzq0ef6.execute-api.us-east-1.amazonaws.com/prod/ask',
      {
        prompt: event.arguments.prompt
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${event.arguments.token}`
        }
      }
    );

    // Return the data from the external API
    return response.data;
  } catch (error: any) {
    console.error('Error calling external API:', error);
    return {
      error: error.message || 'Unknown error occurred',
      base64_image: ''
    };
  }
}; 