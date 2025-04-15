import { injectable } from 'tsyringe';
import type {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  LLMClientInterface,
} from '../core/interfaces/LLMClientInterface.ts';

/**
 * A stub LLM client that echoes the last user message in the response.
 * Used as the default implementation until a real LLM backend (e.g., Ollama) is wired in.
 */
@injectable()
export class DefaultLLMClient implements LLMClientInterface {
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const lastUserMsg = request.messages.findLast((m) => m.role === 'user');

    const reply: ChatMessage = {
      role: 'assistant',
      content: `Echo: ${lastUserMsg?.content ?? '(no user message)'}`,
    };

    return {
      id: 'stub-llm-response',
      created: Math.floor(Date.now() / 1000),
      model: 'default-stub-model',
      choices: [
        {
          index: 0,
          message: reply,
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: request.messages.length,
        completion_tokens: 1,
        total_tokens: request.messages.length + 1,
      },
    };
  }
}
