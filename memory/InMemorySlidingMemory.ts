import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface';
import type {
  MemorySession,
  MemoryStoreInterface,
} from '@ollamec/framework/core/interfaces/MemoryStoreInterface';
import { injectable } from 'tsyringe';

/**
 * `InMemorySlidingMemory` is a simple in-memory implementation of `MemoryStoreInterface`.
 *
 * It stores messages in a local `Map` keyed by session ID, making it suitable for:
 * - Stateless agents
 * - Local development or unit testing
 * - Quick prototyping without external storage dependencies
 *
 * This implementation is non-persistent and not safe for distributed use.
 */
@injectable()
export class InMemorySlidingMemory implements MemoryStoreInterface {
  /**
   * The session ID currently in use. This must be set via `connect()` before
   * memory can be loaded or written.
   */
  protected currentSessionId: string | null = null;

  /**
   * Internal storage for chat history, keyed by session ID.
   *
   * Each session holds its own array of messages. Data is held in memory and
   * lost on process restart.
   */
  protected memory: Map<string, ChatMessage[]> = new Map();

  /**
   * Connects this memory store to a session, creating the session entry if needed.
   *
   * Must be called before `load()` or `append()` can be used.
   *
   * @param session - The session to connect to
   * @returns A promise that resolves to `true` once connected
   */
  async connect(session: MemorySession): Promise<boolean> {
    this.currentSessionId = session.id;

    if (!this.memory.has(session.id)) {
      this.memory.set(session.id, []);
    }

    return true;
  }

  /**
   * Loads a list of chat messages for the currently connected session.
   *
   * If `limit` or `offset` are specified, the returned messages are sliced accordingly.
   *
   * @param options - Paging options:
   *   - `limit`: maximum number of messages to return
   *   - `offset`: number of messages to skip from the beginning
   * @returns A promise resolving to the relevant messages, or an empty array if no session is connected
   */
  async load(options?: { limit?: number; offset?: number }): Promise<
    ChatMessage[]
  > {
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
   *
   * Messages are added to the end of the session's message history. If no session is
   * connected, this method returns `false`.
   *
   * @param messages - One or more messages to store
   * @returns A promise resolving to `true` if successful, or `false` if no session is connected
   */
  async append(messages: ChatMessage[]): Promise<boolean> {
    if (!this.currentSessionId) {
      return false;
    }

    const existing = this.memory.get(this.currentSessionId) ?? [];
    existing.push(...messages);
    this.memory.set(this.currentSessionId, existing);

    return true;
  }
}
