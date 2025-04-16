import { describe, expect, it } from 'bun:test';
import {
  DefaultToolManager,
  type RegisteredTool,
} from '@ollamec/framework/core/DefaultToolManager.ts';
import type { ToolResult } from '@ollamec/framework/core/interfaces/ToolManagerInterface.ts';

describe('DefaultToolManager', () => {
  const echoTool: RegisteredTool = async (args) => args.join('-');
  const failTool: RegisteredTool = async () => {
    throw new Error('Tool exploded');
  };

  const toolManager = new DefaultToolManager({
    echo: echoTool,
    fail: failTool,
  });

  it('executes a registered tool and returns its output', async () => {
    const input = 'echo(foo,bar)';
    const results = await toolManager.runTools({ input });

    const expected: ToolResult[] = [
      { name: 'echo', success: true, output: 'foo-bar' },
    ];

    expect(results).toEqual(expected);
  });

  it('returns an error result when tool is not registered', async () => {
    const input = 'unknownTool()';
    const results = await toolManager.runTools({ input });

    expect(results[0]).toMatchObject({
      name: 'unknownTool',
      success: false,
      error: expect.stringContaining('not found'),
    });
  });

  it('catches tool errors and marks result as failed', async () => {
    const input = 'fail()';
    const results = await toolManager.runTools({ input });

    expect(results[0]).toMatchObject({
      name: 'fail',
      success: false,
      error: 'Tool exploded',
    });
  });

  it('returns empty result list when input has no tool calls', async () => {
    const results = await toolManager.runTools({ input: 'just some text' });
    expect(results).toEqual([]);
  });

  it('executes multiple tool calls in sequence', async () => {
    const input = 'echo(one,two) unknownTool() echo(three)';
    const results = await toolManager.runTools({ input });

    expect(results.length).toBe(3);
    expect(results[0]).toMatchObject({ name: 'echo', success: true });
    expect(results[1]).toMatchObject({ name: 'unknownTool', success: false });
    expect(results[2]).toMatchObject({ name: 'echo', success: true });
  });
});
