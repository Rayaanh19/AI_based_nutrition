import axios from 'axios';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

export async function chatWithOllama(prompt) {
  const url = `${OLLAMA_HOST}/api/chat`;
  const { data } = await axios.post(url, {
    model: OLLAMA_MODEL,
    messages: [
      { role: 'system', content: 'You are a helpful nutrition and meal planning assistant.' },
      { role: 'user', content: prompt },
    ],
    stream: false,
    options: {
      temperature: 0.4,
    },
  }, {
    timeout: 120000,
  });

  if (data && data.message && data.message.content) {
    return data.message.content;
  }
  return typeof data === 'string' ? data : JSON.stringify(data);
}
