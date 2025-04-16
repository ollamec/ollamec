import type {
  ToolInvocationContext,
  ToolManagerInterface,
  ToolResult,
} from '@ollamec/framework/core/interfaces/ToolManagerInterface.ts';
import { injectable } from 'tsyringe';

/**
 * A function-based tool registered to the ToolManager.
 *
 * Tools receive parsed string arguments and optional metadata.
 */
export type RegisteredTool = (
  args: string[],
  metadata?: Record<string, unknown>
) => Promise<unknown>;

/**
 * The `DefaultToolManager` is the built-in implementation of `ToolManagerInterface`.
 *
 * It is responsible for:
 * - Parsing tool call syntax from raw user input (`toolName(arg1, arg2)`)
 * - Dispatching calls to the appropriate tool handlers
 * - Capturing success/failure output in structured `ToolResult[]` format
 *
 * Tool registration is passed via constructor as a map of name → handler function.
 * This class is registered by default in the DI container and can be replaced or extended
 * via `ollamec.config.ts`.
 */
@injectable()
export class DefaultToolManager implements ToolManagerInterface {
  /**
   * Map of tool names to async tool implementations.
   * Subclasses may override or extend this registry.
   */
  protected readonly registry: Record<string, RegisteredTool>;

  /**
   * Create a new `DefaultToolManager`.
   *
   * @param registry - A mapping of tool names to async tool functions.
   *                   Each tool receives parsed args and optional metadata.
   */
  constructor(registry: Record<string, RegisteredTool> = {}) {
    this.registry = registry;
  }

  /**
   * Extracts tool calls from input text and dispatches them to registered tools.
   *
   * Returns one `ToolResult` per attempted invocation, including errors
   * for missing or failed tools.
   *
   * @param context - Tool execution context including raw input and optional metadata
   * @returns A list of structured results for each detected tool call
   */
  public async runTools(context: ToolInvocationContext): Promise<ToolResult[]> {
    const toolCalls = this.extractToolCalls(context.input);
    const results: ToolResult[] = [];

    for (const { name, args } of toolCalls) {
      const tool = this.registry[name];

      if (!tool) {
        results.push({
          name,
          success: false,
          output: null,
          error: `Tool "${name}" not found`,
        });
        continue;
      }

      try {
        const output = await tool(args, context.metadata);
        results.push({ name, success: true, output });
      } catch (err) {
        results.push({
          name,
          success: false,
          output: null,
          error:
            err instanceof Error
              ? {
                  message: err.message,
                  stack: err.stack,
                  name: err.name,
                  cause: (err as Error & { cause?: unknown }).cause,
                }
              : String(err),
        });
      }
    }

    return results;
  }

  /**
   * Parses a string to extract tool calls in the form: `toolName(arg1, arg2)`
   *
   * This uses a basic regular expression. It does **not** support nested calls,
   * quoted strings, or escaped characters — only flat arg lists.
   *
   * Subclasses may override this method to customize parsing logic.
   *
   * @param input - Raw string potentially containing tool invocations
   * @returns A list of parsed tool calls with name and individual argument strings
   */
  protected extractToolCalls(
    input: string
  ): { name: string; args: string[] }[] {
    const regex = /([a-zA-Z_][a-zA-Z0-9_]*)\(([^)]*)\)/g;
    const matches: { name: string; args: string[] }[] = [];

    for (const match of input.matchAll(regex)) {
      const name = match[1];
      const args = match[2]
        .split(',')
        .map((arg) => arg.trim())
        .filter((arg) => arg.length > 0);

      matches.push({ name, args });
    }

    return matches;
  }
}
