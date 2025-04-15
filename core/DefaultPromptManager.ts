import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface.ts';
import type {
  PromptContext,
  PromptManagerInterface,
} from '@ollamec/framework/core/interfaces/PromptManagerInterface.ts';
import { injectable } from 'tsyringe';

/**
 * Default implementation of the `PromptManagerInterface`.
 * Simply turns user input into a single-message prompt.
 */
@injectable()
export class DefaultPromptManager implements PromptManagerInterface {
  async buildPrompt(context: PromptContext): Promise<ChatMessage[]> {
    return [
      {
        role: 'user',
        content: context.userInput,
      },
    ];
  }
}
