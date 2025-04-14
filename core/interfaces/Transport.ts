/**
 * A structured MCP request to the Transport layer.
 */
export interface TransportMessage {
  /**
   * A unique ID for the request or interaction.
   */
  id: string;

  /**
   * The raw user input to be processed by the LLM.
   */
  input: string;

  /**
   * Optional metadata or headers passed from the client.
   */
  metadata?: Record<string, unknown>;
}

/**
 * A structured response emitted by the Transport layer.
 */
export interface TransportResponse {
  /**
   * The ID of the request this response corresponds to.
   */
  id: string;

  /**
   * The final output from the LLM (or error info).
   */
  output: string;

  /**
   * Whether the response was delivered successfully.
   */
  success: boolean;

  /**
   * Optional error message or details.
   */
  error?: string;
}

/**
 * The Transport interface handles inbound and outbound communication
 * between the MCP client and its external environment (e.g., CLI, server, etc).
 *
 * Implementations can stream, buffer, or batch responses.
 */
export interface Transport {
  /**
   * Process an incoming transport message and emit a response.
   *
   * @param message - The inbound transport message.
   * @returns A promise resolving to a structured response.
   */
  handle(message: TransportMessage): Promise<TransportResponse>;
}
