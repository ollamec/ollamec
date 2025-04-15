import { TOKENS, registerClass } from '../config/ollamec.config.ts';

import { DefaultLLMClient } from '@ollamec/framework/llm/DefaultLLMClient';
import { DefaultTransport } from '@ollamec/framework/mcp/DefaultTransport';
import { InMemorySlidingMemory } from '../memory/InMemorySlidingMemory.ts';
import { DefaultPromptManager } from './DefaultPromptManager.ts';
import { DefaultToolManager } from './DefaultToolManager.ts';

/**
 * Registers the default Ollamec strategy implementations into the global DI container.
 *
 * These bindings connect the framework's DI tokens to default internal classes for:
 * - Prompt composition (`PromptManagerInterface`)
 * - Tool execution (`ToolManagerInterface`)
 * - Memory session handling (`MemoryStore`)
 *
 * Developers can override these bindings by registering custom implementations
 * using the same tokens in their own `src/config/ollamec.config.ts` file.
 *
 * This method should be invoked once during Ollamec bootstrap.
 */
export function registerBuiltInImplementations(): void {
  /**
   * Register the default prompt manager used to construct LLM input messages.
   */
  registerClass(TOKENS.PromptManager, DefaultPromptManager);

  /**
   * Register the default tool manager, which currently returns empty tool results.
   */
  registerClass(TOKENS.ToolManager, DefaultToolManager);

  /**
   * Register the default in-memory memory store for loading and saving chat history.
   */
  registerClass(TOKENS.MemoryStore, InMemorySlidingMemory);

  /**
   * Register the default LLM client, which returns a stubbed echo response.
   */
  registerClass(TOKENS.LLMClient, DefaultLLMClient);

  /**
   * Register the default transport layer, which simulates LLM interaction.
   */
  registerClass(TOKENS.Transport, DefaultTransport);
}
