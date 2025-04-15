import { describe, expect, it } from 'bun:test';
import { InMemorySlidingMemory } from '@ollamec/framework/memory/InMemorySlidingMemory';

describe('InMemorySlidingMemory', () => {
  it('should instantiate without error', () => {
    const memory = new InMemorySlidingMemory();
    expect(memory).toBeDefined();
  });
});
