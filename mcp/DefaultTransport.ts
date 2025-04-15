import { injectable } from 'tsyringe';
import type {
  Transport,
  TransportMessage,
  TransportResponse,
} from '../core/interfaces/Transport.ts';

/**
 * A default Transport implementation that simulates LLM output.
 * Used for development and testing. This implementation does not
 * invoke any LLM — it simply returns a canned response.
 */
@injectable()
export class DefaultTransport implements Transport {
  async handle(message: TransportMessage): Promise<TransportResponse> {
    return {
      id: message.id,
      output: `Received: ${message.input}`,
      success: true,
    };
  }
}
