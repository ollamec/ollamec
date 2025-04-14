import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface';

/**
 * The context of a memory session.
 */
export interface MemorySession {
  /**
   * A unique session ID for the current memory instance.
   */
  sessionId: string;

  /**
   * Optional tag for memory segmentation or routing.
   */
  tag?: string;
}

/**
 * MemoryStore is responsible for storing and retrieving
 * past LLM messages based on a given session.
 *
 * This allows the prompt manager to inject relevant prior context.
 */
export interface MemoryStore {
  /**
   * Retrieve prior messages from memory for a given session.
   *
   * @param session - The memory session context.
   * @returns An ordered array of previous messages.
   */
  load(session: MemorySession): Promise<ChatMessage[]>;

  /**
   * Store new messages to memory for a given session.
   *
   * @param session - The memory session context.
   * @param messages - The messages to store (typically from the latest exchange).
   */
  save(session: MemorySession, messages: ChatMessage[]): Promise<void>;
}
