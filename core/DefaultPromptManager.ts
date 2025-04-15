import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface.ts';
import type {
  PromptContext,
  PromptManagerInterface,
} from '@ollamec/framework/core/interfaces/PromptManagerInterface.ts';
import { injectable } from 'tsyringe';

/**
 * Default implementation of the `PromptManagerInterface`.
 * Composes the final prompt array by including historical context and user input.
 */
@injectable()
export class DefaultPromptManager implements PromptManagerInterface {
  async buildPrompt(context: PromptContext): Promise<ChatMessage[]> {
    const chatHistory = context.chatHistory ?? [];

    const userMessage: ChatMessage = {
      role: 'user',
      content: context.userInput,
    };

    return [...chatHistory, userMessage];
  }
}
