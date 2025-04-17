import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface';
import type {
  MemorySession,
  MemoryStoreInterface,
} from '@ollamec/framework/core/interfaces/MemoryStoreInterface';
import { injectable } from 'tsyringe';

/**
 * `InMemorySlidingMemory` is a capped, in-memory implementation of `MemoryStoreInterface`.
 *
 * ⚠️ This class enforces a sliding window of recent messages using a `maxMessages` limit.
 * Older messages are trimmed automatically in `append()` as new ones are added.
 *
 * It stores messages in a local `Map` keyed by session ID, making it suitable for:
 * - Stateless agents
 * - Local development or unit testing
 * - Quick prototyping without external storage dependencies
 *
 * @remarks
 * This implementation is non-persistent and not safe for distributed environments.
 */
@injectable()
export class InMemorySlidingMemory implements MemoryStoreInterface {
  /**
   * The maximum number of messages to retain per session.
   * Older messages are discarded when this limit is exceeded.
   *
   * @defaultValue 100
   */
  protected maxMessages: number;

  /**
   * The session ID currently in use. Must be set via `connect()` before memory operations.
   */
  protected currentSessionId: string | null = null;

  /**
   * Internal storage for message history, keyed by session ID.
   */
  protected memory: Map<string, ChatMessage[]> = new Map();

  /**
   * Creates a new instance of `InMemorySlidingMemory`.
   *
   * @param maxMessages - The maximum number of messages to retain per session. Defaults to 100.
   */
  constructor(maxMessages = 100) {
    this.maxMessages = maxMessages;
  }

  /**
   * Connects to a memory session, preparing the store for future operations.
   * If the session does not yet exist in memory, it is initialized.
   *
   * @param session - The session to activate.
   * @returns A promise resolving to `true` once connected.
   */
  async connect(session: MemorySession): Promise<boolean> {
    this.currentSessionId = session.id;

    if (!this.memory.has(session.id)) {
      this.memory.set(session.id, []);
    }

    return true;
  }

  /**
   * Loads a paged list of messages for the currently connected session.
   *
   * @param options - Optional paging parameters:
   *   - `limit`: maximum number of messages to return
   *   - `offset`: number of messages to skip from the start
   * @returns A promise resolving to a sliced list of messages, or an empty array if not connected.
   */
  async load(options?: {
    limit?: number;
    offset?: number;
  }): Promise<ChatMessage[]> {
    if (!this.currentSessionId) {
      return [];
    }

    const messages = this.memory.get(this.currentSessionId) ?? [];
    const start = options?.offset ?? 0;
    const end =
      options?.limit !== undefined ? start + options.limit : undefined;

    return messages.slice(start, end);
  }

  /**
   * Appends new messages to the currently connected session.
   * If the total exceeds `maxMessages`, older messages are removed from the front.
   *
   * @param messages - One or more chat messages to store.
   * @returns `true` if messages were stored successfully, or `false` if no session is connected or the array is empty.
   */
  async append(messages: ChatMessage[]): Promise<boolean> {
    if (!this.currentSessionId || messages.length === 0) {
      return false;
    }

    const sessionMessages = this.memory.get(this.currentSessionId) ?? [];
    sessionMessages.push(...messages);

    // Trim oldest messages if over cap
    if (sessionMessages.length > this.maxMessages) {
      sessionMessages.splice(0, sessionMessages.length - this.maxMessages);
    }

    this.memory.set(this.currentSessionId, sessionMessages);
    return true;
  }
}
