import type {
  TransportInterface,
  TransportMessage,
  TransportResponse,
} from '@ollamec/framework//core/interfaces/TransportInterface.ts';
import { injectable } from 'tsyringe';

/**
 * A default TransportInterface implementation that simulates LLM output.
 * Used for development and testing. This implementation does not
 * invoke any LLM — it simply returns a canned response.
 */
@injectable()
export class DefaultTransport implements TransportInterface {
  async handle(message: TransportMessage): Promise<TransportResponse> {
    return {
      id: message.id,
      output: `Received: ${message.input}`,
      success: true,
    };
  }
}
