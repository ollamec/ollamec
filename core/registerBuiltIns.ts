import { TOKENS, registerClass } from '../config/ollamec.config.ts';

// TODO: Import real implementations as they are created
import { DefaultPromptManager } from './DefaultPromptManager.ts';
import { DefaultToolManager } from './DefaultToolManager.ts';
// import { InMemorySlidingMemory } from '../memory/InMemorySlidingMemory.ts';

/**
 * Registers the default Ollamec strategy implementations into the DI container.
 * These can be overridden by developer config in `src/config/ollamec.config.ts`.
 */
export function registerBuiltInImplementations(): void {
  // Uncomment and register as each class becomes available:
  registerClass(TOKENS.PromptManager, DefaultPromptManager);
  registerClass(TOKENS.ToolManager, DefaultToolManager);
  // registerClass(TOKENS.MemoryStore, InMemorySlidingMemory);
}
