import { beforeAll, describe, expect, it } from 'bun:test';
import { container } from 'tsyringe';

import { TOKENS } from '@ollamec/framework/config/ollamec.config.ts';
import { DefaultPromptManager } from '@ollamec/framework/core/DefaultPromptManager';
import { DefaultToolManager } from '@ollamec/framework/core/DefaultToolManager.ts';
import type { MemoryStoreInterface } from '@ollamec/framework/core/interfaces/MemoryStoreInterface.ts';
import type { PromptManagerInterface } from '@ollamec/framework/core/interfaces/PromptManagerInterface';
import type { ToolManagerInterface } from '@ollamec/framework/core/interfaces/ToolManagerInterface.ts';
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

  it('should resolve PromptManager to DefaultPromptManager by default', () => {
    const promptManager = container.resolve<PromptManagerInterface>(
      TOKENS.PromptManager
    );
    expect(promptManager).toBeInstanceOf(DefaultPromptManager);
  });

  it('should resolve ToolManager to DefaultToolManager by default', () => {
    const toolManager = container.resolve<ToolManagerInterface>(
      TOKENS.ToolManager
    );
    expect(toolManager).toBeInstanceOf(DefaultToolManager);
  });

  // Additional DI resolution tests (LLMClient, PromptManager, etc) can be added here
});
