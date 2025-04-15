/**
 * Represents a single message in the LLM conversation.
 */
export interface ChatMessage {
  /**
   * The role of the message sender. Common values are 'system', 'user', and 'assistant',
   * but custom strings may be used for specialized agents or tools (e.g., 'function', 'search-agent').
   */
  role: 'system' | 'user' | 'assistant' | string;

  /**
   * The content of the message.
   */
  content: string;

  /**
   * Optional name of the participant (e.g., for tools or named agents).
   */
  name?: string;
}

/**
 * The input shape for an LLM chat request.
 */
export interface ChatRequest {
  /**
   * The ordered list of conversation messages.
   */
  messages: ChatMessage[];

  /**
   * Sampling temperature (higher = more random).
   */
  temperature?: number;

  /**
   * Maximum number of tokens to generate.
   */
  max_tokens?: number;

  /**
   * Optional stop sequences to end generation.
   */
  stop?: string[];

  /**
   * Additional backend-specific options.
   */
  [key: string]: unknown;
}

/**
 * The response shape from an LLM chat completion.
 */
export interface ChatResponse {
  /**
   * Unique ID for the chat response.
   */
  id: string;

  /**
   * Unix timestamp (in seconds) for when the response was created.
   */
  created: number;

  /**
   * Identifier for the model used to generate the response.
   */
  model: string;

  /**
   * List of message choices returned by the model.
   */
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;

  /**
   * Optional token usage details.
   */
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };

  /**
   * Additional backend-specific metadata.
   */
  [key: string]: unknown;
}

/**
 * Interface for an LLM client implementation.
 *
 * This abstraction allows plugging in different LLM providers (e.g., Ollama, OpenAI, Claude)
 * using the Strategy pattern. Implementations must be registered via DI.
 */
export interface LLMClientInterface {
  /**
   * Executes a chat completion request.
   *
   * @param request - The chat request object containing message history and options.
   * @returns A promise resolving to the structured chat response.
   */
  chat(request: ChatRequest): Promise<ChatResponse>;
}
