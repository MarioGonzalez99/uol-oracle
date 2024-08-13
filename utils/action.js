'use server'

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateChatResponse = async (messages) => {
  try {
    const response = await openai.chat.completions.create(
      {
        model: process.env.OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          ...messages,
        ],
        temperature: 0.2,
        max_tokens: 150,
      }
    );
    return response.choices[0].message;
  } catch (error) {
    return null;
  }
};
