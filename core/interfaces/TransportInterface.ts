/**
 * A structured MCP request to the TransportInterface layer.
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
 * A structured response emitted by the TransportInterface layer.
 */
export interface TransportResponse {
  /**
   * The ID of the request this response corresponds to.
   */
  id: string;

  /**
   * The final output from the LLM (or a fallback message in case of error).
   */
  output: string;

  /**
   * Whether the response was delivered successfully.
   */
  success: boolean;

  /**
   * Optional structured error object containing additional diagnostics.
   */
  error?: {
    /**
     * A human-readable description of the error.
     */
    message: string;

    /**
     * An optional error code for programmatic handling.
     */
    code?: string;

    /**
     * Arbitrary structured data related to the error.
     */
    details?: Record<string, unknown>;

    /**
     * An optional stack trace for debugging purposes.
     */
    stack?: string;
  };
}

/**
 * The TransportInterface interface handles inbound and outbound communication
 * between the MCP client and its external environment (e.g., CLI, server, etc).
 *
 * Implementations can stream, buffer, or batch responses.
 */
export interface TransportInterface {
  /**
   * Process an incoming transport message and emit a response.
   *
   * @param message - The inbound transport message.
   * @returns A promise resolving to a structured response.
   */
  handle(message: TransportMessage): Promise<TransportResponse>;
}
