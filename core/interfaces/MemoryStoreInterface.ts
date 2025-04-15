import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface';

/**
 * Context metadata for a memory session.
 * A session groups messages together across invocations.
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
 * Interface for storing and retrieving chat message history
 * tied to a specific memory session.
 *
 * Used by the PromptManager to inject prior context into prompts.
 */
export interface MemoryStoreInterface {
  /**
   * Retrieve prior messages from memory for a given session.
   *
   * @param session - The memory session context.
   * @param options - Optional pagination controls:
   *   - `limit`: Maximum number of messages to retrieve (most recent first).
   *   - `offset`: Number of recent messages to skip (for pagination).
   * @returns An ordered array of previous messages, typically in chronological order.
   */
  load(
    session: MemorySession,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<ChatMessage[]>;

  /**
   * Store new messages to memory for a given session.
   *
   * @param session - The memory session context.
   * @param messages - The messages to store (typically from the latest exchange).
   */
  save(session: MemorySession, messages: ChatMessage[]): Promise<void>;
}
