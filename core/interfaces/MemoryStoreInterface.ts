import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface';

/**
 * A unique session identifier used by memory stores to scope stored and retrieved messages.
 *
 * This session is typically assigned per conversation or per user and is required
 * before memory operations (such as load or append) can occur.
 *
 * Orchestration layers (e.g., `OllamecClient`) should determine how memory is used
 * — for example, how many messages to retrieve or when to reset state.
 */
export interface MemorySession {
  /**
   * A unique session ID (e.g., thread ID, conversation UUID).
   */
  id: string;

  /**
   * Optional human-readable label for logging, debugging, or UI display.
   */
  label?: string;
}

/**
 * A standard contract for memory store implementations in Ollamec.
 *
 * Memory stores are responsible for storing and retrieving messages within the
 * scope of a connected session. Each session is isolated by its unique ID.
 *
 * Implementations can vary (in-memory, Redis, file-backed, etc.) but must adhere
 * to this interface for compatibility with the core orchestration flow.
 */
export interface MemoryStoreInterface {
  /**
   * Connects to a session, preparing the store for subsequent memory operations.
   *
   * @param session - The session to initialize or activate.
   * @returns A promise resolving to `true` if the connection was successful.
   */
  connect(session: MemorySession): Promise<boolean>;

  /**
   * Loads a set of stored chat messages for the currently connected session.
   *
   * Supports optional pagination via `limit` and `offset` to avoid exceeding
   * token budgets or memory constraints during prompt construction.
   *
   * @param options - Optional paging parameters:
   *   - `limit`: Maximum number of messages to return.
   *   - `offset`: Number of messages to skip from the beginning.
   * @returns A promise resolving to an array of chat messages.
   */
  load(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ChatMessage[]>;

  /**
   * Appends new chat messages to the memory store for the current session.
   *
   * Implementations should persist or buffer these messages appropriately.
   *
   * @param messages - One or more chat messages to store.
   * @returns A promise resolving to `true` if messages were stored successfully.
   */
  append(messages: ChatMessage[]): Promise<boolean>;
}
