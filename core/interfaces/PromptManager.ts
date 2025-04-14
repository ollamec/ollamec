import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface';

/**
 * Context information passed to the PromptManager.
 */
export interface PromptContext {
  /**
   * The raw user input message.
   */
  userInput: string;

  /**
   * The current memory state (e.g., previous messages or summary).
   */
  memory?: ChatMessage[];

  /**
   * The result of tool calls relevant to this prompt.
   */
  toolResponses?: Record<string, unknown>;

  /**
   * Optional metadata or runtime-specific context.
   */
  metadata?: Record<string, unknown>;
}

/**
 * PromptManager is responsible for building the final prompt messages
 * array to be sent to the LLM.
 *
 * Implementations can customize how memory, tools, and user input are
 * composed into a structured prompt.
 */
export interface PromptManager {
  /**
   * Compose an array of structured prompt messages.
   *
   * @param context - The prompt context including user input, memory, tools, etc.
   * @returns A list of messages to send to the LLM.
   */
  buildPrompt(context: PromptContext): Promise<ChatMessage[]>;
}
