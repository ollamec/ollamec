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

  it('should include tool responses as tool messages', async () => {
    const manager = new DefaultPromptManager();

    const result = await manager.buildPrompt({
      userInput: 'What did the calculator return?',
      chatHistory: [],
      toolResponses: {
        calculator: { result: 42 },
        search: { results: ['foo', 'bar'] },
      },
    });

    expect(result).toEqual([
      {
        role: 'tool',
        content: '[calculator]\n{"result":42}',
      },
      {
        role: 'tool',
        content: '[search]\n{"results":["foo","bar"]}',
      },
      {
        role: 'user',
        content: 'What did the calculator return?',
      },
    ]);
  });
});
