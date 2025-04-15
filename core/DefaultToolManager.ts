import type {
  ToolInvocationContext,
  ToolManagerInterface,
  ToolResult,
} from '@ollamec/framework/core/interfaces/ToolManagerInterface.ts';
import { injectable } from 'tsyringe';

/**
 * Default implementation of `ToolManagerInterface`.
 * Returns an empty tool result set — no tools are registered by default.
 */
@injectable()
export class DefaultToolManager implements ToolManagerInterface {
  async runTools(_context: ToolInvocationContext): Promise<ToolResult[]> {
    return []; // Stub: no-op tool execution
  }
}
