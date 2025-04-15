import { injectable } from 'tsyringe';
import type {
  ToolInvocationContext,
  ToolManager,
  ToolResult,
} from './interfaces/ToolManager.ts';

/**
 * Default implementation of `ToolManager`.
 * Returns an empty tool result set — no tools are registered by default.
 */
@injectable()
export class DefaultToolManager implements ToolManager {
  async runTools(_context: ToolInvocationContext): Promise<ToolResult[]> {
    return []; // Stub: no-op tool execution
  }
}
