/**
 * Represents the result of executing a single tool.
 */
export interface ToolResult {
  /**
   * Name of the tool (must match the call in prompt).
   */
  name: string;

  /**
   * Raw or structured output of the tool.
   */
  output: unknown;

  /**
   * Whether the tool executed successfully.
   */
  success: boolean;

  /**
   * Optional error message or object if the tool failed.
   */
  error?: string | Record<string, unknown>;
}

/**
 * Input shape for executing tools within the ToolManagerInterface.
 */
export interface ToolInvocationContext {
  /**
   * The raw user input or parsed tool call string.
   */
  input: string;

  /**
   * Optional metadata or context shared with tools.
   */
  metadata?: Record<string, unknown>;
}

/**
 * ToolManagerInterface is responsible for parsing and executing tool calls.
 *
 * It returns structured tool results that can be injected into the prompt flow.
 */
export interface ToolManagerInterface {
  /**
   * Run tools based on the input and return their structured results.
   *
   * @param context - The tool invocation context including input and metadata.
   * @returns A list of tool results (may be empty if no tool matches).
   */
  runTools(context: ToolInvocationContext): Promise<ToolResult[]>;
}
