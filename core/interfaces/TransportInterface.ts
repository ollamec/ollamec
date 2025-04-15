/**
 * A message received by the Transport layer to initiate processing.
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
 * A structured response returned by the Transport layer.
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
 * Interface for handling inbound and outbound message transport.
 *
 * Transport implementations serve as entrypoints (e.g., CLI, server, SSE)
 * and translate between raw input and structured LLM output.
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
