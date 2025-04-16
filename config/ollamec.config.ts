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

  /** A registry of built-in prompt templates (used by PromptManager) */
  PromptTemplates: Symbol('PromptTemplates'),
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
 * Registers a plain value or object instance to the given DI token.
 * Useful for injecting constants or registries like built-in templates.
 *
 * @param token - DI symbol from `TOKENS`
 * @param value - The instance or literal value to bind
 */
export function registerValue<T>(token: OllamecToken, value: T): void {
  container.registerInstance<T>(token, value);
}

/**
 * Generic class constructor type used for dependency injection.
 *
 * Represents any class that can be instantiated with arbitrary arguments
 * and returns an instance of type `T`.
 *
 * This allows `registerClass()` to accept a wide range of valid implementations.
 */
// biome-ignore lint/suspicious/noExplicitAny: necessary to support DI constructor flexibility
type Constructor<T> = new (...args: any[]) => T;
