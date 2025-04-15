import { describe, expect, it } from 'bun:test';
import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface.ts';
import { InMemorySlidingMemory } from '@ollamec/framework/memory/InMemorySlidingMemory.ts';

const session = { sessionId: 'test-session' };

const sampleMessages: ChatMessage[] = [
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
  { role: 'user', content: 'What’s the weather?' },
  { role: 'assistant', content: 'Sunny.' },
];

describe('InMemorySlidingMemory', () => {
  it('saves and retrieves messages for a session', async () => {
    const memory = new InMemorySlidingMemory();
    await memory.save(session, sampleMessages);
    const loaded = await memory.load(session);
    expect(loaded).toEqual(sampleMessages);
  });

  it('respects limit and offset when loading', async () => {
    const memory = new InMemorySlidingMemory();
    await memory.save(session, sampleMessages);

    const lastTwo = await memory.load(session, { limit: 2 });
    expect(lastTwo).toEqual([
      { role: 'user', content: 'What’s the weather?' },
      { role: 'assistant', content: 'Sunny.' },
    ]);

    const offsetOne = await memory.load(session, { limit: 1, offset: 1 });
    expect(offsetOne).toEqual([
      { role: 'user', content: 'What’s the weather?' },
    ]);
  });

  it('throws if session has no messages', async () => {
    const memory = new InMemorySlidingMemory();
    expect(memory.load({ sessionId: 'missing' })).rejects.toThrow(
      'No messages found'
    );
  });

  it('evicts old messages when exceeding maxMessages', async () => {
    const memory = new InMemorySlidingMemory(5); // limit to 5 messages
    const session = { sessionId: 'eviction-test' };

    const messages = Array.from({ length: 10 }, (_, i) => ({
      role: 'user',
      content: `Message ${i + 1}`,
    }));

    await memory.save(session, messages);

    const loaded = await memory.load(session);
    expect(loaded).toHaveLength(5);
    expect(loaded[0].content).toBe('Message 6'); // oldest retained
    expect(loaded[4].content).toBe('Message 10'); // most recent
  });
});
