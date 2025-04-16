import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface';

/**
 * Context information passed to the PromptManagerInterface.
 */
export interface PromptContext {
  /**
   * The raw user input message.
   */
  userInput: string;

  /**
   * The historical messages from memory (already fetched).
   * Optional — when not provided, the prompt will be generated without conversation context.
   */
  chatHistory?: ChatMessage[];

  /**
   * The results from external tool executions that should be included in the prompt.
   * For example: { "search": { results: [...] }, "calculator": { result: 42 } }
   */
  toolResponses?: Record<string, unknown>;

  /**
   * Optional metadata or runtime-specific context.
   */
  metadata?: Record<string, unknown>;
}

/**
 * PromptManagerInterface is responsible for building the final prompt messages
 * array to be sent to the LLM.
 *
 * Implementations can customize how memory, tools, and user input are
 * composed into a structured prompt.
 */
export interface PromptManagerInterface {
  /**
   * Compose an array of structured prompt messages.
   *
   * @param context - The prompt context including user input, memory, tools, etc.
   * @returns A list of messages to send to the LLM.
   */
  buildPrompt(context: PromptContext): Promise<ChatMessage[]>;
}
