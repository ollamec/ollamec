import type { ChatMessage } from '@ollamec/framework/core/interfaces/LLMClientInterface.ts';
import type {
  MemorySession,
  MemoryStoreInterface,
} from '@ollamec/framework/core/interfaces/MemoryStoreInterface.ts';
import { injectable } from 'tsyringe';

/**
 * A basic in-memory implementation of `MemoryStoreInterface`.
 * Stores all messages in a local map by session ID.
 * No eviction, pagination is simulated via slice.
 *
 * ⚠️ WARNING: This implementation does not persist data across application restarts.
 * For production use, consider implementing a persistent memory strategy.
 */
@injectable()
export class InMemorySlidingMemory implements MemoryStoreInterface {
  private store = new Map<string, ChatMessage[]>();

  async load(
    session: MemorySession,
    options?: { limit?: number; offset?: number }
  ): Promise<ChatMessage[]> {
    const allMessages = this.store.get(session.sessionId);
    if (!allMessages) {
      throw new Error('No messages found for session');
    }
    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? allMessages.length;
    return allMessages.slice(-offset - limit, -offset || undefined);
  }

  async save(session: MemorySession, messages: ChatMessage[]): Promise<void> {
    const existing = this.store.get(session.sessionId) ?? [];
    this.store.set(session.sessionId, [...existing, ...messages]);
  }
}
