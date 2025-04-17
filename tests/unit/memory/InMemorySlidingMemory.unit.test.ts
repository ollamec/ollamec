import { describe, expect, it } from 'bun:test';
import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface.ts';
import { InMemorySlidingMemory } from '@ollamec/framework/memory/InMemorySlidingMemory.ts';

const session = { id: 'test-session' };

const sampleMessages: ChatMessage[] = [
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
  { role: 'user', content: 'What’s the weather?' },
  { role: 'assistant', content: 'Sunny.' },
];

describe('InMemorySlidingMemory', () => {
  it('stores and retrieves messages for a session', async () => {
    const memory = new InMemorySlidingMemory();
    await memory.connect(session);
    await memory.append(sampleMessages);
    const loaded = await memory.load();
    expect(loaded).toEqual(sampleMessages);
  });

  it('respects limit and offset when loading', async () => {
    const memory = new InMemorySlidingMemory();
    await memory.connect(session);
    await memory.append(sampleMessages);

    const lastTwo = await memory.load({ limit: 2, offset: 2 });
    expect(lastTwo).toEqual([
      { role: 'user', content: 'What’s the weather?' },
      { role: 'assistant', content: 'Sunny.' },
    ]);

    const offsetOne = await memory.load({ limit: 1, offset: 2 });
    expect(offsetOne).toEqual([
      { role: 'user', content: 'What’s the weather?' },
    ]);
  });

  it('evicts oldest messages when exceeding maxMessages', async () => {
    const memory = new InMemorySlidingMemory(5);
    await memory.connect({ id: 'sliding-window' });

    const messages = Array.from({ length: 10 }, (_, i) => ({
      role: 'user',
      content: `Message ${i + 1}`,
    }));

    await memory.append(messages);
    const loaded = await memory.load();
    expect(loaded).toHaveLength(5);
    expect(loaded[0].content).toBe('Message 6');
    expect(loaded[4].content).toBe('Message 10');
  });

  it('returns empty array if loading before connect', async () => {
    const memory = new InMemorySlidingMemory();
    const loaded = await memory.load();
    expect(loaded).toEqual([]);
  });

  it('allows append() with an empty array (no-op)', async () => {
    const memory = new InMemorySlidingMemory();
    await memory.connect(session);
    const result = await memory.append([]);
    expect(result).toBe(false);
  });

  it('returns false when appending without connecting first', async () => {
    const memory = new InMemorySlidingMemory();
    const result = await memory.append([{ role: 'user', content: 'orphan' }]);
    expect(result).toBe(false);
  });

  it('allows calling connect() multiple times for the same session', async () => {
    const memory = new InMemorySlidingMemory();
    const firstConnect = await memory.connect(session);
    const secondConnect = await memory.connect(session);
    expect(firstConnect).toBe(true);
    expect(secondConnect).toBe(true);
  });

  it('isolates memory between sessions', async () => {
    const memory = new InMemorySlidingMemory();

    const sessionA = { id: 'A' };
    const sessionB = { id: 'B' };

    await memory.connect(sessionA);
    await memory.append([{ role: 'user', content: 'From A' }]);

    await memory.connect(sessionB);
    await memory.append([{ role: 'user', content: 'From B' }]);

    await memory.connect(sessionA);
    const fromA = await memory.load();
    expect(fromA).toEqual([{ role: 'user', content: 'From A' }]);

    await memory.connect(sessionB);
    const fromB = await memory.load();
    expect(fromB).toEqual([{ role: 'user', content: 'From B' }]);
  });
});
