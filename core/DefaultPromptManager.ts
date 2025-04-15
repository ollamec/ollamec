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
    const messages: ChatMessage[] = [];

    // 1. Add chat history
    if (context.chatHistory) {
      messages.push(...context.chatHistory);
    }

    // 2. Add tool responses
    if (context.toolResponses) {
      for (const [toolName, result] of Object.entries(context.toolResponses)) {
        messages.push({
          role: 'tool',
          content: `[${toolName}]\n${JSON.stringify(result)}`,
        });
      }
    }

    // 3. Add user input
    messages.push({
      role: 'user',
      content: context.userInput,
    });

    return messages;
  }
}
