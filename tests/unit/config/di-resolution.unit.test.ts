import { beforeAll, describe, expect, it } from 'bun:test';
import { container } from 'tsyringe';

import { TOKENS } from '@ollamec/framework/config/ollamec.config.ts';
import type { MemoryStoreInterface } from '@ollamec/framework/core/interfaces/MemoryStoreInterface.ts';
import { registerBuiltInImplementations } from '@ollamec/framework/core/registerBuiltIns.ts';
import { InMemorySlidingMemory } from '@ollamec/framework/memory/InMemorySlidingMemory.ts';

describe('Dependency Injection Container', () => {
  beforeAll(() => {
    // Register all built-in implementations once
    registerBuiltInImplementations();
  });

  it('should resolve MemoryStore to InMemorySlidingMemory by default', () => {
    const memoryStore = container.resolve<MemoryStoreInterface>(
      TOKENS.MemoryStore
    );
    expect(memoryStore).toBeInstanceOf(InMemorySlidingMemory);
  });

  // Additional DI resolution tests (LLMClient, PromptManager, etc) can be added here
});
