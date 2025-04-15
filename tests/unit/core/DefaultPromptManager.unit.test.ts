import { describe, expect, it } from 'bun:test';
import { DefaultPromptManager } from '@ollamec/framework/core/DefaultPromptManager';

describe('DefaultPromptManager', () => {
  it('should instantiate without error', () => {
    const manager = new DefaultPromptManager();
    expect(manager).toBeDefined();
  });

  it('should prepend chat history before the user input', async () => {
    const manager = new DefaultPromptManager();

    const result = await manager.buildPrompt({
      userInput: 'Tell me about Ollamec.',
      chatHistory: [
        { role: 'user', content: 'Hi' },
        { role: 'assistant', content: 'Hello! How can I help you?' },
      ],
    });

    expect(result).toEqual([
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello! How can I help you?' },
      { role: 'user', content: 'Tell me about Ollamec.' },
    ]);
  });
});
