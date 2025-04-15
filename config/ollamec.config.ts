import { container } from 'tsyringe';

/**
 * Dependency Injection tokens for Ollamec pluggable services.
 * These symbols decouple interfaces from implementations and allow override via DI.
 */
export const TOKENS = {
  /** Manages prompt assembly and formatting for LLMs */
  PromptManager: Symbol('PromptManager'),

  /** Handles tool call parsing and routing */
  ToolManager: Symbol('ToolManager'),

  /** Manages long-term memory across sessions */
  MemoryStore: Symbol('MemoryStore'),

  /** LLM client wrapper for chatting with model backend */
  LLMClient: Symbol('LLMClient'),

  /** Transport mechanism for message delivery (e.g., CLI, SSE) */
  Transport: Symbol('Transport'),
} as const;

/**
 * Union of all injectable DI tokens used by the Ollamec framework.
 * These tokens are used to register or resolve services via `tsyringe`.
 */
export type OllamecToken = (typeof TOKENS)[keyof typeof TOKENS];

/**
 * Registers a concrete class implementation to the given DI token.
 * This helper ensures consistent DI usage throughout Ollamec.
 *
 * @param token - DI symbol from `TOKENS`
 * @param impl - Class constructor to bind to that token
 */
export function registerClass<T>(
  token: OllamecToken,
  impl: Constructor<T>
): void {
  container.register<T>(token, { useClass: impl });
}

/**
 * Internal helper type for class constructors used in DI.
 */
// biome-ignore lint/suspicious/noExplicitAny: necessary to support DI constructor flexibility
type Constructor<T> = new (...args: any[]) => T;
