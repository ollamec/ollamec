import { injectable } from 'tsyringe';
import type { ChatMessage } from './interfaces/LLMClientInterface.ts';
import type {
  PromptContext,
  PromptManager,
} from './interfaces/PromptManager.ts';

/**
 * Default implementation of the `PromptManager`.
 * Simply turns user input into a single-message prompt.
 */
@injectable()
export class DefaultPromptManager implements PromptManager {
  async buildPrompt(context: PromptContext): Promise<ChatMessage[]> {
    return [
      {
        role: 'user',
        content: context.userInput,
      },
    ];
  }
}
