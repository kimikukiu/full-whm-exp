
import { OpenRouter } from '@openrouter/sdk';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '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', // Fallback to provided key
  defaultHeaders: {
    'HTTP-Referer': 'https://whoamisec.pro',
    'X-OpenRouter-Title': 'WHOAMISEC_PRO',
  },
});

export const openRouterService = {
  chat: async (message: string, context: string = '', model: string = 'openai/gpt-4o') => {
    try {
      const completion = await openRouter.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: `You are an advanced AI assistant integrated into WHOAMISEC_PRO. Context: ${context}`
          },
          {
            role: 'user',
            content: message,
          },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter Chat Error:', error);
      throw error;
    }
  },

  // Direct fetch implementation for environments where SDK might have issues or for custom payloads
  chatDirect: async (message: string, context: string = '', model: string = 'openai/gpt-4o') => {
     try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`,
          "HTTP-Referer": "https://whoamisec.pro",
          "X-OpenRouter-Title": "WHOAMISEC_PRO",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": model,
          "messages": [
            {
              "role": "system",
              "content": `You are an advanced AI assistant integrated into WHOAMISEC_PRO. Context: ${context}`
            },
            {
              "role": "user",
              "content": message
            }
          ]
        })
      });
      
      const data = await response.json();
      return data.choices[0].message.content;
     } catch (error) {
       console.error('OpenRouter Direct Fetch Error:', error);
       throw error;
     }
  }
};
